import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Terminal, Calendar, Eye, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

export default function ArticleDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState<any>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then(res => res.json())
      .then(data => setArticle(data))
      .catch(err => console.error(err));
    fetch('/api/settings').then(res => res.json()).then(setSettings).catch(console.error);
  }, [id]);

  if (!article) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-mono">
      <span className="animate-pulse">{t('articles.loading')}</span>
    </div>
  );

  const title = article[`title_${i18n.language}`] || article.title;
  const content = article[`content_${i18n.language}`] || article.content;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-gray-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/10 dark:bg-purple-900/10 blur-[60px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-20 mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
            <ChevronLeft size={20} /> {t('projects.back')}
          </Link>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold tracking-tighter">
            <Terminal size={16} className="text-cyan-600 dark:text-cyan-400" /> {settings.heroName ? `${settings.heroName.toLowerCase()}.dev` : 'portfolio.dev'}
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6 relative z-10">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <header className="mb-12">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 font-mono">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString()}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600" />
              <span className="flex items-center gap-1"><Eye size={14} /> {article.views} {t('articles.views')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-4 pt-8 border-t border-gray-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">Admin</div>
                <div className="text-xs text-gray-500">{t('articles.authorRole')}</div>
              </div>
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert prose-cyan max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                <Share2 size={20} />
              </button>
            </div>
            <Link to="/" className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline">
              {t('projects.back')}
            </Link>
          </footer>
        </motion.article>
      </main>
    </div>
  );
}
