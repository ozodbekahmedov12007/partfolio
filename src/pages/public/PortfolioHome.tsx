import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, Mail, Send, ChevronRight, Terminal, Code2, Database, Cpu, Layers, Heart, MessageSquare, Instagram, Linkedin, Twitter, Lock, Moon, Sun, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function PortfolioHome() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [socials, setSocials] = useState([]);
  const [articles, setArticles] = useState([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    setLangMenuOpen(false);
  };

  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(setProjects).catch(console.error);
    fetch('/api/skills').then(res => res.json()).then(setSkills).catch(console.error);
    fetch('/api/socials').then(res => res.json()).then(setSocials).catch(console.error);
    fetch('/api/articles').then(res => res.json()).then(setArticles).catch(console.error);
    fetch('/api/settings').then(res => res.json()).then(setSettings).catch(console.error);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('submitting');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setContactStatus('idle'), 3000);
      } else {
        setContactStatus('error');
      }
    } catch (err) {
      setContactStatus('error');
    }
  };

  const getLocalizedSetting = (key: string, fallback: string) => {
    const localizedKey = `${key}_${i18n.language}`;
    return settings[localizedKey] || settings[key] || fallback;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-gray-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200 overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Spiral Logo Representation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 dark:opacity-20">
          <div className="absolute inset-0 rounded-full border-[40px] border-t-cyan-400 border-r-blue-500 border-b-purple-600 border-l-transparent animate-spin-slow blur-[8px]" />
          <div className="absolute inset-8 rounded-full border-[30px] border-t-transparent border-r-cyan-400 border-b-blue-500 border-l-purple-600 animate-spin-reverse-slow blur-[6px]" />
          <div className="absolute inset-16 rounded-full border-[20px] border-t-purple-600 border-r-transparent border-b-cyan-400 border-l-blue-500 animate-spin-slow blur-[4px]" />
        </div>
        
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[60px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 dark:bg-purple-900/20 blur-[60px]" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-cyan-400/10 dark:bg-cyan-600/10 blur-[50px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-20 mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tighter flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white">
              <Terminal size={18} />
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              {settings.heroName ? `${settings.heroName.toLowerCase()}.dev` : 'portfolio.dev'}
            </span>
          </motion.div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">{t('nav.about')}</a>
              <a href="#skills" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">{t('nav.skills')}</a>
              <a href="#projects" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">{t('nav.projects')}</a>
              {articles.length > 0 && (
                <a href="#articles" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">{t('nav.articles')}</a>
              )}
              <a href="#contact" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">{t('nav.contact')}</a>
            </nav>
            
            <div className="flex items-center gap-3 border-l border-gray-200 dark:border-white/10 pl-6">
              <div className="relative">
                <button 
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <Globe size={18} />
                  <span className="text-xs font-bold uppercase">{i18n.language}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                    {['en', 'uz', 'ru'].map(lng => (
                      <button
                        key={lng}
                        onClick={() => changeLanguage(lng)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${i18n.language === lng ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {lng.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                {t('hero.available')}
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
                {getLocalizedSetting('heroGreeting', t('hero.greeting'))} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600">
                  {getLocalizedSetting('heroRole', t('hero.role'))}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mb-10 leading-relaxed">
                {getLocalizedSetting('heroDescription', t('hero.description'))}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#projects" className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-blue-600 dark:hover:from-cyan-400 dark:hover:to-blue-500 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2">
                  {t('hero.viewWork')} <ChevronRight size={18} />
                </a>
                <a href="#contact" className="px-8 py-4 bg-gray-200 dark:bg-white/5 text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-white/10 transition-all">
                  {t('hero.contactMe')}
                </a>
              </div>
            </motion.div>

            {/* Abstract Architectural Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block h-[500px] w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 rounded-full blur-xl opacity-50 animate-pulse" />
              
              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [-10, 10, -10], rotate: [0, 2, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] right-[10%] w-64 h-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mb-3">
                  <Layers size={16} className="text-cyan-400" />
                </div>
                <div className="h-2 w-24 bg-white/10 rounded-full mb-2" />
                <div className="h-2 w-16 bg-white/10 rounded-full" />
              </motion.div>

              <motion.div 
                animate={{ y: [10, -10, 10], rotate: [0, -2, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] left-[5%] w-56 h-40 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                  <Database size={16} className="text-purple-400" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/10 rounded-full" />
                  <div className="h-2 w-4/5 bg-white/10 rounded-full" />
                  <div className="h-2 w-full bg-white/10 rounded-full" />
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [-15, 15, -15], rotate: [0, 3, 0] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[10%] right-[20%] w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-white/10 rounded-full p-6 shadow-2xl flex items-center justify-center"
              >
                <div className="absolute inset-2 border border-cyan-500/20 rounded-full animate-spin-slow" />
                <div className="absolute inset-6 border border-purple-500/20 rounded-full animate-spin-reverse-slow" />
                <Cpu size={32} className="text-cyan-400" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 border-t border-gray-200 dark:border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">
                  <Terminal size={14} />
                  <span>{getLocalizedSetting('aboutTitle', t('about.title'))}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">{getLocalizedSetting('aboutSubtitle', t('about.whoAmI'))}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {getLocalizedSetting('aboutDescription1', t('about.description1'))}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {getLocalizedSetting('aboutDescription2', t('about.description2'))}
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="border-l-2 border-cyan-500 pl-4">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{settings.experienceYears || '3+'}</div>
                    <div className="text-sm text-gray-500 font-medium">{t('about.experience')}</div>
                  </div>
                  <div className="border-l-2 border-purple-500 pl-4">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{settings.projectsCompleted || '20+'}</div>
                    <div className="text-sm text-gray-500 font-medium">{t('about.projects')}</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-[500px] rounded-3xl overflow-hidden bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700" />
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" alt="Coding setup" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-6 border-t border-gray-200 dark:border-white/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{t('services.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('services.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: t('services.frontend'), desc: t('services.frontendDesc'), icon: <Code2 className="text-cyan-600 dark:text-cyan-400" size={24} /> },
                { title: t('services.backend'), desc: t('services.backendDesc'), icon: <Database className="text-purple-600 dark:text-purple-400" size={24} /> },
                { title: t('services.architecture'), desc: t('services.architectureDesc'), icon: <Terminal className="text-blue-600 dark:text-blue-400" size={24} /> }
              ].map((service, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm dark:shadow-none">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {service.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Marquee */}
        <div className="py-10 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.01] overflow-hidden flex whitespace-nowrap relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 dark:from-[#030712] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 dark:from-[#030712] to-transparent z-10" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            className="flex gap-16 items-center px-8"
          >
            {/* Double the list for seamless loop */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 items-center">
                <span className="text-2xl font-bold text-gray-300 dark:text-white/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">React</span>
                <span className="text-2xl font-bold text-gray-300 dark:text-white/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Next.js</span>
                <span className="text-2xl font-bold text-gray-300 dark:text-white/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">TypeScript</span>
                <span className="text-2xl font-bold text-gray-300 dark:text-white/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Node.js</span>
                <span className="text-2xl font-bold text-gray-300 dark:text-white/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">PostgreSQL</span>
                <span className="text-2xl font-bold text-gray-300 dark:text-white/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">TailwindCSS</span>
                <span className="text-2xl font-bold text-gray-300 dark:text-white/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Prisma</span>
                <span className="text-2xl font-bold text-gray-300 dark:text-white/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Docker</span>
                <span className="text-2xl font-bold text-gray-300 dark:text-white/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">AWS</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Skills Section */}
        <section id="skills" className="py-24 px-6 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{t('skills.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('skills.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from(new Set(skills.map((s: any) => s.category))).map((category: any, idx) => {
                const categorySkills = skills.filter((s: any) => s.category === category);
                const localizedCategory = categorySkills[0][`category_${i18n.language}`] || category;
                const icon = category.toLowerCase() === 'frontend' ? <Code2 className="text-cyan-600 dark:text-cyan-400" size={24} /> :
                             category.toLowerCase() === 'backend' ? <Database className="text-purple-600 dark:text-purple-400" size={24} /> :
                             <Cpu className="text-blue-600 dark:text-blue-400" size={24} />;
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-colors shadow-sm dark:shadow-none"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6">
                      {icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{localizedCategory}</h3>
                    {categorySkills.length === 0 ? (
                      <p className="text-gray-500 text-sm">{t('skills.noSkills')}</p>
                    ) : (
                      <div className="space-y-5">
                        {categorySkills.map((skill: any) => (
                          <div key={skill.id}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                              <span className="text-gray-500 font-mono">{skill.percentage || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.percentage || 0}%` }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-24 px-6 border-t border-gray-200 dark:border-white/5 relative">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{t('experience.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('experience.subtitle')}</p>
            </div>
            
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-white/10 before:to-transparent">
              {(t('experience.items', { returnObjects: true }) as any[]).map((exp, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f172a] text-cyan-600 dark:text-cyan-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full group-hover:scale-150 transition-transform" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-cyan-500/30 transition-colors shadow-sm dark:shadow-none">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{exp.role}</h3>
                      <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-400/10 px-2 py-1 rounded-md w-max">{exp.period}</span>
                    </div>
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-4">{exp.company}</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 px-6 border-t border-gray-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{t('projects.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{t('projects.subtitle')}</p>
              </div>
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-sm">
                <Layers size={16} /> {projects.length} {t('projects.systemsActive')}
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                <p className="text-gray-500 font-mono">{t('projects.noProjects')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project: any, idx: number) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 transition-all duration-500 flex flex-col shadow-sm dark:shadow-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0f172a] z-10 pointer-events-none" />
                    
                    {project.imageUrl && (
                      <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay group-hover:opacity-0 transition-opacity z-10" />
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" 
                          referrerPolicy="no-referrer" 
                          loading="lazy"
                        />
                      </div>
                    )}
                    
                    <div className="p-8 flex flex-col flex-1 relative z-20 -mt-12">
                      <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-xl mb-4 inline-block self-start">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {project[`title_${i18n.language}`] || project.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-1 text-sm">
                        {project[`description_${i18n.language}`] || project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map((tech: string) => (
                          <span key={tech} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs rounded-md font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-6 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <Heart size={16} className={project.likes > 0 ? "text-red-500" : ""} /> {project.likes || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare size={16} /> {project.comments?.length || 0}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/10 mt-auto">
                        <Link to={`/project/${project.id}`} className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 flex items-center gap-1 transition-colors">
                          {t('projects.viewProject')} <ChevronRight size={16} />
                        </Link>
                        <div className="flex gap-3">
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                              <Github size={18} />
                            </a>
                          )}
                          {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 text-white rounded-lg text-sm font-medium hover:from-cyan-500 hover:to-blue-600 dark:hover:from-cyan-400 dark:hover:to-blue-500 transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                              {t('projects.liveDemo')} <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Articles Section */}
        {articles.length > 0 && (
          <section id="articles" className="py-24 px-6 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
              <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{t('articles.title')}</h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{t('articles.subtitle')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: any, idx: number) => (
                  <motion.div 
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white dark:bg-[#0f172a] rounded-2xl p-8 border border-gray-200 dark:border-white/10 hover:border-cyan-500/50 transition-all duration-500 flex flex-col h-full shadow-sm dark:shadow-none"
                  >
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4 font-mono">
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                      <span className="flex items-center gap-1"><Terminal size={14} /> {article.views} {t('articles.views')}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {article[`title_${i18n.language}`] || article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed flex-1 text-sm">
                      {(article[`content_${i18n.language}`] || article.content).replace(/[#*`_]/g, '').substring(0, 150)}...
                    </p>
                    <Link to={`/article/${article.id}`} className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 flex items-center gap-1 transition-colors mt-auto w-max">
                      {t('articles.readArticle')} <ChevronRight size={16} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 border-t border-gray-200 dark:border-white/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{t('contact.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('contact.subtitle')}</p>
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm dark:shadow-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[40px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[40px]" />
              
              <form onSubmit={handleContactSubmit} className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('contact.name')}</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={e => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder={t('contact.namePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('contact.email')}</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={e => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder={t('contact.emailPlaceholder')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('contact.message')}</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                    placeholder={t('contact.messagePlaceholder')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactStatus === 'submitting'}
                  className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 text-white rounded-xl font-bold hover:from-cyan-500 hover:to-blue-600 dark:hover:from-cyan-400 dark:hover:to-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  {contactStatus === 'submitting' ? t('contact.sending') : contactStatus === 'success' ? t('contact.sent') : (
                    <>{t('contact.send')} <Send size={18} /></>
                  )}
                </button>
                {contactStatus === 'error' && (
                  <p className="text-red-500 dark:text-red-400 text-sm text-center mt-2">{t('contact.error')}</p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#030712] py-8 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold tracking-tighter">
            <Terminal size={16} className="text-cyan-600 dark:text-cyan-400" /> {settings.heroName ? `${settings.heroName.toLowerCase()}.dev` : 'portfolio.dev'}
          </div>
          
          <div className="flex items-center gap-6">
            <p className="text-sm text-gray-500 font-mono">
              v1.0.0 © {new Date().getFullYear()} {getLocalizedSetting('footerText', t('footer.rights'))}
            </p>
          </div>

          <div className="flex gap-4 text-gray-500">
            {socials.map((social: any) => {
              const platform = social.platform.toLowerCase();
              let Icon = ExternalLink;
              if (platform.includes('github')) Icon = Github;
              if (platform.includes('instagram')) Icon = Instagram;
              if (platform.includes('linkedin')) Icon = Linkedin;
              if (platform.includes('twitter') || platform.includes('x')) Icon = Twitter;
              
              return (
                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}

