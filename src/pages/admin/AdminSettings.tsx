import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const [activeLang, setActiveLang] = useState<'en' | 'uz' | 'ru'>('en');
  const [settings, setSettings] = useState<Record<string, string>>({
    heroName: 'Ozodbek',
    heroGreeting_en: "Hi, I'm",
    heroGreeting_uz: "Salom, men",
    heroGreeting_ru: "Привет, я",
    heroRole_en: 'Full-Stack Developer',
    heroRole_uz: 'Full-Stack Dasturchi',
    heroRole_ru: 'Full-Stack Разработчик',
    heroDescription_en: 'I build scalable web applications and craft beautiful digital experiences.',
    heroDescription_uz: 'Men kengaytiriladigan veb-ilovalarni yarataman va ajoyib raqamli tajribalarni taqdim etaman.',
    heroDescription_ru: 'Я создаю масштабируемые веб-приложения и красивые цифровые интерфейсы.',
    aboutTitle_en: 'About Me',
    aboutTitle_uz: 'Men Haqimda',
    aboutTitle_ru: 'Обо мне',
    aboutSubtitle_en: 'A brief look into my background and what drives me.',
    aboutSubtitle_uz: 'Mening tajribam va maqsadlarim haqida qisqacha ma\'lumot.',
    aboutSubtitle_ru: 'Краткий обзор моего опыта и того, что меня вдохновляет.',
    aboutDescription1_en: 'I am a passionate software engineer with a strong foundation in both front-end and back-end development. I love solving complex problems and turning ideas into reality through code.',
    aboutDescription1_uz: 'Men front-end va back-end dasturlashda kuchli poydevorga ega bo\'lgan ishtiyoqli dasturiy ta\'minot muhandisiman. Murakkab muammolarni hal qilishni va g\'oyalarni kod orqali haqiqatga aylantirishni yaxshi ko\'raman.',
    aboutDescription1_ru: 'Я страстный инженер-программист с прочным фундаментом как во фронтенд, так и в бэкенд разработке. Я люблю решать сложные задачи и воплощать идеи в реальность с помощью кода.',
    aboutDescription2_en: 'My journey in tech started with a curiosity for how things work on the web. Over the years, I\'ve honed my skills in modern JavaScript frameworks, server-side technologies, and database management.',
    aboutDescription2_uz: 'Texnologiyadagi sayohatim vebda narsalar qanday ishlashiga bo\'lgan qiziqishdan boshlangan. Yillar davomida men zamonaviy JavaScript freymvorklari, server texnologiyalari va ma\'lumotlar bazalarini boshqarish bo\'yicha o\'z mahoratimni oshirdim.',
    aboutDescription2_ru: 'Мой путь в технологиях начался с любопытства к тому, как все работает в интернете. За годы я отточил свои навыки в современных JavaScript фреймворках, серверных технологиях и управлении базами данных.',
    experienceYears: '3+',
    projectsCompleted: '20+',
    happyClients: '15+',
    footerText_en: 'All systems operational.',
    footerText_uz: 'Barcha tizimlar ishlamoqda.',
    footerText_ru: 'Все системы работают нормально.',
    telegramBotToken: '',
    telegramAdminId: '',
    smtpUser: 'ozodbekahmedov12007@gmail.com',
    smtpPass: 'tvliaxtwevnhakkq',
    resendApiKey: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingBot, setIsTestingBot] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ email: '', password: '' });
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (Object.keys(data).length > 0) {
            setSettings(prev => ({ ...prev, ...data }));
          }
        }

        // Also fetch current admin email
        const token = localStorage.getItem('adminToken');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setAdminCreds(prev => ({ ...prev, email: payload.email }));
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestBot = async () => {
    setIsTestingBot(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/test-bot', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert('Sinov xabari yuborildi! Telegram botingizni tekshiring.');
      } else {
        alert(`Xatolik: ${data.error}`);
      }
    } catch (error) {
      console.error('Error testing bot:', error);
      alert('Xatolik yuz berdi.');
    } finally {
      setIsTestingBot(false);
    }
  };

  const handleUpdateCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminCreds.email) return alert('Email is required');
    
    setIsUpdatingCreds(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(adminCreds)
      });
      if (res.ok) {
        alert('Admin credentials updated! Please log in again if you changed your email.');
        if (adminCreds.password) {
          setAdminCreds(prev => ({ ...prev, password: '' }));
        }
      } else {
        const data = await res.json();
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      alert('Error updating credentials');
    } finally {
      setIsUpdatingCreds(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Settings</h2>
          <div className="flex gap-2">
            {(['en', 'uz', 'ru'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${activeLang === lang ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form className="space-y-8">
          
          {/* Hero Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Hero Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input type="text" name="heroName" value={settings.heroName} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Greeting ({activeLang.toUpperCase()})</label>
                <input type="text" name={`heroGreeting_${activeLang}`} value={settings[`heroGreeting_${activeLang}`]} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role ({activeLang.toUpperCase()})</label>
                <input type="text" name={`heroRole_${activeLang}`} value={settings[`heroRole_${activeLang}`]} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description ({activeLang.toUpperCase()})</label>
                <textarea rows={2} name={`heroDescription_${activeLang}`} value={settings[`heroDescription_${activeLang}`]} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">About Section</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title ({activeLang.toUpperCase()})</label>
                  <input type="text" name={`aboutTitle_${activeLang}`} value={settings[`aboutTitle_${activeLang}`]} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle ({activeLang.toUpperCase()})</label>
                  <input type="text" name={`aboutSubtitle_${activeLang}`} value={settings[`aboutSubtitle_${activeLang}`]} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description Paragraph 1 ({activeLang.toUpperCase()})</label>
                <textarea rows={3} name={`aboutDescription1_${activeLang}`} value={settings[`aboutDescription1_${activeLang}`]} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description Paragraph 2 ({activeLang.toUpperCase()})</label>
                <textarea rows={3} name={`aboutDescription2_${activeLang}`} value={settings[`aboutDescription2_${activeLang}`]} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Years Experience</label>
                <input type="text" name="experienceYears" value={settings.experienceYears} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Projects Completed</label>
                <input type="text" name="projectsCompleted" value={settings.projectsCompleted} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Happy Clients</label>
                <input type="text" name="happyClients" value={settings.happyClients} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Footer</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Footer Text ({activeLang.toUpperCase()})</label>
              <input type="text" name={`footerText_${activeLang}`} value={settings[`footerText_${activeLang}`]} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {/* Telegram Settings */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Telegram Bot Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bot Token</label>
                <input type="password" name="telegramBotToken" value={settings.telegramBotToken} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter bot token" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Admin ID</label>
                <input type="text" name="telegramAdminId" value={settings.telegramAdminId} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter admin chat ID" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-gray-500 italic">* Changes to bot settings require a server restart to take full effect.</p>
              <button
                type="button"
                onClick={handleTestBot}
                disabled={isTestingBot || !settings.telegramBotToken}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isTestingBot ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isTestingBot ? 'Testing...' : 'Test Bot Connection'}
              </button>
            </div>
          </div>

          {/* SMTP Settings */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Email (SMTP) Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">SMTP Email</label>
                <input type="email" name="smtpUser" value={settings.smtpUser} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter Gmail address" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">App Password</label>
                <input type="password" name="smtpPass" value={settings.smtpPass} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter Google App Password" />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 italic">* Used for sending replies from the Telegram bot to users via email.</p>
          </div>

          {/* Resend API Settings */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Resend API (Alternative to SMTP)</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Resend API Key</label>
                <input type="password" name="resendApiKey" value={settings.resendApiKey} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="re_..." />
                <p className="mt-2 text-xs text-gray-500">
                  Resend is a more reliable alternative to Gmail SMTP. You can get a free API key at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">resend.com</a>.
                </p>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-red-600 border-b border-red-100 pb-2 mb-4">Security (Admin Access)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Email</label>
                <input 
                  type="email" 
                  value={adminCreds.email} 
                  onChange={e => setAdminCreds({...adminCreds, email: e.target.value})} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                <input 
                  type="password" 
                  value={adminCreds.password} 
                  onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                  placeholder="Min 6 characters"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleUpdateCreds}
                disabled={isUpdatingCreds}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold disabled:opacity-50 shadow-sm"
              >
                {isUpdatingCreds ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isUpdatingCreds ? 'Updating...' : 'Update Admin Credentials'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
