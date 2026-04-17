import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const globalForBot = globalThis as unknown as {
  bot: TelegramBot | undefined
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-dev';

// Email Setup Helper
async function getTransporter() {
  const smtpUser = await getSetting('smtpUser', process.env.SMTP_USER || 'ozodbekahmedov12007@gmail.com');
  const smtpPass = await getSetting('smtpPass', process.env.SMTP_PASS || 'tvliaxtwevnhakkq');
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser.trim(),
      pass: smtpPass.replace(/\s/g, ''),
    },
  });
}

async function sendEmailReply(to: string, text: string) {
  const resendApiKey = await getSetting('resendApiKey', process.env.RESEND_API_KEY || '');
  const smtpUser = await getSetting('smtpUser', process.env.SMTP_USER || 'ozodbekahmedov12007@gmail.com');
  const smtpPass = await getSetting('smtpPass', process.env.SMTP_PASS || 'tvliaxtwevnhakkq');

  // Try Resend first if API key is provided
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: 'Portfolio <onboarding@resend.dev>', // Default Resend domain
        to: to,
        subject: 'Re: Your message from Portfolio',
        text: text,
      });
      return { success: true, method: 'Resend' };
    } catch (error: any) {
      console.error('Resend error:', error);
      // Fallback to SMTP if Resend fails
    }
  }

  // Fallback to SMTP
  const isSmtpConfigured = smtpUser && smtpUser.includes('@') && smtpPass;
  if (isSmtpConfigured) {
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: smtpUser,
      to: to,
      subject: 'Re: Your message from Portfolio',
      text: text,
    });
    return { success: true, method: 'SMTP' };
  }

  throw new Error('Hech qanday email xizmati (Resend yoki SMTP) sozlangan emas.');
}

const replyingTo: Record<number, { messageId: string, email: string }> = {}; // chatId -> { messageId, email }

async function getSetting(key: string, defaultValue: string): Promise<string> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key } });
    return setting?.value || defaultValue;
  } catch {
    return defaultValue;
  }
}

async function initTelegramBot() {
  const TELEGRAM_BOT_TOKEN = await getSetting('telegramBotToken', '8231514153:AAHCQ4nvvEjl4ssGAl04n9aUEFhPzYjGfTY');
  const TELEGRAM_ADMIN_ID_STR = await getSetting('telegramAdminId', '5976393074');
  const TELEGRAM_ADMIN_ID = parseInt(TELEGRAM_ADMIN_ID_STR);

  if (TELEGRAM_BOT_TOKEN) {
    // Stop existing bot if it exists in globalThis (for dev restarts)
    if (globalForBot.bot) {
      try {
        console.log('Stopping existing Telegram bot polling...');
        globalForBot.bot.stopPolling();
      } catch (e) {
        console.error('Error stopping existing bot:', e);
      }
    }

    const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
    globalForBot.bot = bot;
    console.log('Bot: Initialized with token:', TELEGRAM_BOT_TOKEN.substring(0, 10) + '...');

    // Clear webhook and start polling
    try {
      await bot.deleteWebHook();
      console.log('Bot: Webhook cleared, starting polling...');
      bot.startPolling();
    } catch (e) {
      console.error('Bot: Error clearing webhook:', e);
      bot.startPolling();
    }

    bot.on('polling_error', (error) => {
      if (error.message.includes('409 Conflict')) {
        const timeoutId = 'bot_retry_timeout';
        if (!(globalThis as any)[timeoutId]) {
          console.warn('Telegram 409 Conflict detected. Another instance might be running. Retrying in 15s...');
          bot.stopPolling();
          (globalThis as any)[timeoutId] = setTimeout(() => {
            delete (globalThis as any)[timeoutId];
            bot.startPolling();
          }, 15000);
        }
      } else {
        console.error('Telegram polling error:', error.message);
      }
    });

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from?.id;

      if (userId !== TELEGRAM_ADMIN_ID) {
        bot.sendMessage(chatId, "Kechirasiz, siz ushbu botdan foydalana olmaysiz.");
        return;
      }

      const appUrl = process.env.APP_URL || 'https://ais-dev-rmgam3lgkcvjnwnqrkx3mb-286698538942.asia-southeast1.run.app';
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📱 Admin Panelni Ochish (Mini App)',
                web_app: { url: `${appUrl}/admin` }
              }
            ],
            [
              {
                text: '🌐 Saytni ko\'rish',
                url: appUrl
              }
            ]
          ]
        }
      };

      bot.sendMessage(chatId, "Assalomu alaykum, Admin! Quyidagi tugmani bosib Mini App orqali admin panelga kiring:", opts);
    });

    bot.onText(/\/status/, async (msg) => {
      const chatId = msg.chat.id;
      if (msg.from?.id !== TELEGRAM_ADMIN_ID) return;

      try {
        const messageCount = await prisma.message.count();
        const unreadCount = await prisma.message.count({ where: { read: false } });
        const resendKey = await getSetting('resendApiKey', '');
        const smtpUser = await getSetting('smtpUser', '');

        const statusText = `📊 **Bot Status**\n\n` +
          `📩 Jami xabarlar: ${messageCount}\n` +
          `🆕 O'qilmagan: ${unreadCount}\n` +
          `📧 Resend: ${resendKey ? "✅ Sozlangan" : "❌ Yo'q"}\n` +
          `📧 SMTP: ${smtpUser ? "✅ Sozlangan" : "❌ Yo'q"}\n` +
          `🕒 Server vaqti: ${new Date().toLocaleString()}`;

        bot.sendMessage(chatId, statusText, { parse_mode: 'Markdown' });
      } catch (e: any) {
        bot.sendMessage(chatId, `❌ Statusni olishda xatolik: ${e.message}`);
      }
    });

    bot.on('callback_query', async (callbackQuery) => {
      const chatId = callbackQuery.message?.chat.id;
      if (!chatId) return;

      if (callbackQuery.data === 'other_site') {
        bot.answerCallbackQuery(callbackQuery.id, { text: "Bu sayt hali qo'shilmagan." });
      } else if (callbackQuery.data?.startsWith('reply_')) {
        const messageId = callbackQuery.data.replace('reply_', '');
        console.log(`Bot: Admin clicked reply for messageId: ${messageId}`);
        
        // Check if message exists before asking for reply
        const dbMessage = await prisma.message.findUnique({ where: { id: messageId } });
        if (!dbMessage) {
          console.error(`Bot: Message lookup failed for ID: ${messageId}`);
          const count = await prisma.message.count();
          console.log(`Bot: Total messages in DB: ${count}`);
          
          bot.answerCallbackQuery(callbackQuery.id, { 
            text: "❌ Xatolik: Bu xabar bazadan topilmadi. Iltimos, xabardagi emailga qo'lda yozing yoki Telegram'ning o'zida 'Reply' qilib ko'ring.",
            show_alert: true 
          });
          return;
        }

        replyingTo[chatId] = { messageId, email: dbMessage.email };
        bot.sendMessage(chatId, `✍️ ${dbMessage.name} (${dbMessage.email}) ga javob yozing:`, {
          reply_markup: { force_reply: true }
        });
        bot.answerCallbackQuery(callbackQuery.id);
      }
    });

    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (!text || text.startsWith('/')) return;

      let targetMessageId: string | null = null;
      let targetEmail: string | null = null;

      // 1. Check if it's a reply to a bot message with tags
      if (msg.reply_to_message?.text) {
        const idMatch = msg.reply_to_message.text.match(/#ID_([a-f0-9-]{36})/);
        const emailMatch = msg.reply_to_message.text.match(/#EMAIL_([^\s\n]+)/);
        
        if (idMatch) {
          targetMessageId = idMatch[1];
          console.log(`Bot: Detected direct reply to message ID: ${targetMessageId}`);
        }
        if (emailMatch) {
          targetEmail = emailMatch[1];
          console.log(`Bot: Detected email from tag: ${targetEmail}`);
        }
      }

      // 2. Fallback to in-memory state
      if (!targetMessageId && replyingTo[chatId]) {
        targetMessageId = replyingTo[chatId].messageId;
        targetEmail = replyingTo[chatId].email;
        console.log(`Bot: Using in-memory state for message ID: ${targetMessageId}`);
      }

      if (targetMessageId) {
        try {
          const dbMessage = await prisma.message.findUnique({ where: { id: targetMessageId } });
          const finalEmail = dbMessage?.email || targetEmail;

          if (!finalEmail) {
            bot.sendMessage(chatId, "❌ Xatolik: Email manzili topilmadi. Iltimos, xabardagi emailga qo'lda yozing.");
            delete replyingTo[chatId];
            return;
          }

          try {
            const result = await sendEmailReply(finalEmail, text);
            bot.sendMessage(chatId, `✅ Javobingiz ${finalEmail} manziliga yuborildi! (${result.method})`);
            
            if (dbMessage) {
              await prisma.message.update({
                where: { id: targetMessageId },
                data: { read: true }
              });
            }
          } catch (emailError: any) {
            console.error('Email sending error:', emailError);
            bot.sendMessage(chatId, `❌ Email yuborishda xatolik: ${emailError.message}`);
          }
          
          delete replyingTo[chatId];
        } catch (error) {
          console.error('Error processing reply:', error);
          bot.sendMessage(chatId, "❌ Xatolik yuz berdi.");
          delete replyingTo[chatId];
        }
      }
    });
    
    console.log('Telegram bot started and listening for commands');

    // Graceful shutdown for the bot
    const stopBot = () => {
      if (globalForBot.bot) {
        console.log('Stopping Telegram bot polling...');
        globalForBot.bot.stopPolling();
      }
    };

    process.once('SIGINT', stopBot);
    process.once('SIGTERM', stopBot);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Telegram Bot
  await initTelegramBot();

  // Trust the reverse proxy (required for rate limiting behind a proxy)
  app.set('trust proxy', 1);

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());
  app.use(cors());
  
  // Helmet for security headers, but disable contentSecurityPolicy for Vite dev server
  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  // Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', apiLimiter);

  // --- API Routes ---

  // Auth Middleware
  const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as any).admin = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Auth Routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      });
      let { email, password } = schema.parse(req.body);
      email = email.trim().toLowerCase();

      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin) {
        console.log(`Login failed: Admin not found for ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        console.log(`Login failed: Password mismatch for ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
      res.json({ message: 'Logged in successfully', token });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: (error as any).errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  });

  app.get('/api/auth/me', authenticateAdmin, async (req, res) => {
    const admin = await prisma.admin.findUnique({ where: { id: (req as any).admin.id }, select: { id: true, email: true } });
    res.json({ admin });
  });

  // Projects Routes
  app.get('/api/projects', async (req, res) => {
    const projects = await prisma.project.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { comments: true }
    });
    res.json(projects.map(p => ({ ...p, techStack: JSON.parse(p.techStack) })));
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const project = await prisma.project.findUnique({
        where: { id: req.params.id },
        include: { comments: { orderBy: { createdAt: 'desc' } } }
      });
      if (!project) return res.status(404).json({ error: 'Not found' });
      res.json({ ...project, techStack: JSON.parse(project.techStack) });
    } catch (e) {
      res.status(500).json({ error: 'Error fetching project' });
    }
  });

  app.post('/api/projects/:id/like', async (req, res) => {
    try {
      const project = await prisma.project.update({
        where: { id: req.params.id },
        data: { likes: { increment: 1 } },
      });
      res.json({ likes: project.likes });
    } catch (e) {
      res.status(500).json({ error: 'Error liking project' });
    }
  });

  app.post('/api/projects/:id/comments', async (req, res) => {
    try {
      const schema = z.object({
        text: z.string().min(1),
        author: z.string().optional().default('Anonymous'),
      });
      const data = schema.parse(req.body);
      const comment = await prisma.comment.create({
        data: {
          text: data.text,
          author: data.author || 'Anonymous',
          projectId: req.params.id
        }
      });
      res.status(201).json(comment);
    } catch (e) {
      res.status(500).json({ error: 'Error adding comment' });
    }
  });

  app.post('/api/projects', authenticateAdmin, async (req, res) => {
    try {
      const schema = z.object({
        title: z.string().min(1),
        title_uz: z.string().optional().or(z.literal('')),
        title_ru: z.string().optional().or(z.literal('')),
        description: z.string().min(1),
        description_uz: z.string().optional().or(z.literal('')),
        description_ru: z.string().optional().or(z.literal('')),
        techStack: z.array(z.string()),
        githubLink: z.string().url().optional().or(z.literal('')),
        liveLink: z.string().url().optional().or(z.literal('')),
        imageUrl: z.string().optional().or(z.literal('')),
      });
      const data = schema.parse(req.body);

      const project = await prisma.project.create({
        data: {
          ...data,
          techStack: JSON.stringify(data.techStack),
        },
      });
      res.status(201).json({ ...project, techStack: JSON.parse(project.techStack) });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: (error as any).errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/projects/:id', authenticateAdmin, async (req, res) => {
    try {
      await prisma.project.delete({ where: { id: req.params.id } });
      res.json({ message: 'Project deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Skills Routes
  app.get('/api/skills', async (req, res) => {
    const skills = await prisma.skill.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(skills);
  });

  app.post('/api/skills', authenticateAdmin, async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().min(1),
        category: z.string().min(1),
        category_uz: z.string().optional().or(z.literal('')),
        category_ru: z.string().optional().or(z.literal('')),
        percentage: z.number().min(0).max(100).optional().default(80),
      });
      const data = schema.parse(req.body);
      const skill = await prisma.skill.create({ data });
      res.status(201).json(skill);
    } catch (e) {
      res.status(500).json({ error: 'Error creating skill' });
    }
  });

  app.delete('/api/skills/:id', authenticateAdmin, async (req, res) => {
    try {
      await prisma.skill.delete({ where: { id: req.params.id } });
      res.json({ message: 'Skill deleted' });
    } catch (e) {
      res.status(500).json({ error: 'Error deleting skill' });
    }
  });

  // Settings Routes
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await prisma.setting.findMany();
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);
      res.json(settingsMap);
    } catch (e) {
      res.status(500).json({ error: 'Error fetching settings' });
    }
  });

  app.post('/api/settings', authenticateAdmin, async (req, res) => {
    try {
      const settings = req.body; // Expecting an object of key-value pairs
      
      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        if (typeof value === 'string') {
          await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
          });
        }
      }
      res.json({ message: 'Settings updated successfully' });
    } catch (e) {
      res.status(500).json({ error: 'Error updating settings' });
    }
  });

  app.post('/api/test-bot', authenticateAdmin, async (req, res) => {
    try {
      if (!globalForBot.bot) {
        return res.status(400).json({ error: 'Telegram bot sozlangan emas.' });
      }
      
      const adminIdStr = await getSetting('telegramAdminId', '5976393074');
      const adminId = parseInt(adminIdStr);
      
      await globalForBot.bot.sendMessage(adminId, "🔔 Bu sinov xabari! Telegram botingiz muvaffaqiyatli ishlamoqda.");
      res.json({ success: true, message: 'Sinov xabari yuborildi!' });
    } catch (error: any) {
      console.error('Test bot error:', error);
      res.status(500).json({ error: `Xatolik: ${error.message}` });
    }
  });

  // Social Links Routes
  app.get('/api/socials', async (req, res) => {
    const socials = await prisma.socialLink.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(socials);
  });

  app.post('/api/socials', authenticateAdmin, async (req, res) => {
    try {
      const schema = z.object({
        platform: z.string().min(1),
        url: z.string().url(),
      });
      const data = schema.parse(req.body);
      const social = await prisma.socialLink.create({ data });
      res.status(201).json(social);
    } catch (e) {
      res.status(500).json({ error: 'Error creating social link' });
    }
  });

  app.delete('/api/socials/:id', authenticateAdmin, async (req, res) => {
    try {
      await prisma.socialLink.delete({ where: { id: req.params.id } });
      res.json({ message: 'Social link deleted' });
    } catch (e) {
      res.status(500).json({ error: 'Error deleting social link' });
    }
  });

  // Articles Routes
  app.get('/api/articles', async (req, res) => {
    const articles = await prisma.article.findMany({ 
      where: { published: true },
      orderBy: { createdAt: 'desc' } 
    });
    res.json(articles);
  });

  app.get('/api/articles/all', authenticateAdmin, async (req, res) => {
    const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(articles);
  });

  app.get('/api/articles/:id', async (req, res) => {
    try {
      const article = await prisma.article.update({
        where: { id: req.params.id },
        data: { views: { increment: 1 } }
      });
      res.json(article);
    } catch (e) {
      res.status(404).json({ error: 'Article not found' });
    }
  });

  app.post('/api/articles', authenticateAdmin, async (req, res) => {
    try {
      const schema = z.object({
        title: z.string().min(1),
        title_uz: z.string().optional().or(z.literal('')),
        title_ru: z.string().optional().or(z.literal('')),
        content: z.string().min(1),
        content_uz: z.string().optional().or(z.literal('')),
        content_ru: z.string().optional().or(z.literal('')),
        published: z.boolean().default(false),
      });
      const data = schema.parse(req.body);
      const article = await prisma.article.create({ data });
      res.status(201).json(article);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: (error as any).errors });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/articles/:id', authenticateAdmin, async (req, res) => {
    try {
      const schema = z.object({
        title: z.string().min(1).optional(),
        title_uz: z.string().optional().or(z.literal('')),
        title_ru: z.string().optional().or(z.literal('')),
        content: z.string().min(1).optional(),
        content_uz: z.string().optional().or(z.literal('')),
        content_ru: z.string().optional().or(z.literal('')),
        published: z.boolean().optional(),
      });
      const data = schema.parse(req.body);
      const article = await prisma.article.update({ where: { id: req.params.id }, data });
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/articles/:id', authenticateAdmin, async (req, res) => {
    try {
      await prisma.article.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Messages Routes
  app.post('/api/messages', async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1),
      });
      const data = schema.parse(req.body);
      const message = await prisma.message.create({ data });
      
      if (globalForBot.bot) {
        const adminIdStr = await getSetting('telegramAdminId', '5976393074');
        const adminId = parseInt(adminIdStr);
        const text = `📬 Yangi xabar!\n\n👤 Ism: ${data.name}\n📧 Email: ${data.email}\n💬 Xabar: ${data.message}\n\n💡 Maslahat: Bu xabarga "Reply" qilib javob yozishingiz mumkin.\n\n#ID_${message.id}\n#EMAIL_${data.email}`;
        
        console.log(`Bot: Attempting to send message to adminId: ${adminId}`);
        globalForBot.bot.sendMessage(adminId, text, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✍️ Bot orqali javob', callback_data: `reply_${message.id}` }
              ]
            ]
          }
        }).then(() => {
          console.log('Bot: Message sent successfully to Telegram');
        }).catch((err) => {
          console.error('Bot: Error sending message to Telegram:', err.message);
        });
      } else {
        console.warn('Bot: globalForBot.bot is not defined, skipping Telegram notification');
      }

      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: (error as any).errors });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/messages', authenticateAdmin, async (req, res) => {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
  });

  app.put('/api/messages/:id/read', authenticateAdmin, async (req, res) => {
    try {
      const message = await prisma.message.update({
        where: { id: req.params.id },
        data: { read: true }
      });
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/messages/:id', authenticateAdmin, async (req, res) => {
    try {
      await prisma.message.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Analytics Route
  app.get('/api/analytics', authenticateAdmin, async (req, res) => {
    const totalProjects = await prisma.project.count();
    const totalArticles = await prisma.article.count();
    const totalMessages = await prisma.message.count();
    const unreadMessages = await prisma.message.count({ where: { read: false } });
    
    // Sum views and likes
    const projects = await prisma.project.findMany({ select: { views: true, likes: true } });
    const totalProjectViews = projects.reduce((acc, p) => acc + p.views, 0);
    const totalProjectLikes = projects.reduce((acc, p) => acc + p.likes, 0);

    const totalComments = await prisma.comment.count();

    res.json({
      totalProjects,
      totalArticles,
      totalMessages,
      unreadMessages,
      totalProjectViews,
      totalProjectLikes,
      totalComments
    });
  });

  app.post('/api/admin/update-credentials', authenticateAdmin, async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6).optional().or(z.literal('')),
      });
      const { email, password } = schema.parse(req.body);
      const adminId = (req as any).admin.id;

      const updateData: any = { email };
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await prisma.admin.update({
        where: { id: adminId },
        data: updateData
      });

      res.json({ message: 'Admin credentials updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update admin credentials' });
    }
  });

  // Force reset/ensure admin for user
  const targetEmail = 'ozodbekahmedov12007@gmail.com';
  const targetPassword = 'ozodbek2280';
  const hashedPassword = await bcrypt.hash(targetPassword, 10);

  // We use a transaction to ensure we have exactly one admin with these credentials
  await prisma.$transaction([
    prisma.admin.deleteMany({
      where: {
        OR: [
          { email: targetEmail },
          { email: 'admin@example.com' }
        ]
      }
    }),
    prisma.admin.create({
      data: {
        email: targetEmail,
        password: hashedPassword,
      }
    })
  ]);
  console.log(`Admin credentials forced to: ${targetEmail} / ${targetPassword}`);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // SPA fallback for dev mode
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const fs = await import('fs');
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
