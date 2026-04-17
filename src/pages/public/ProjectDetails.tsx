import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Github, ExternalLink, Terminal, Layers, Heart, MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function ProjectDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [project, setProject] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const [settings, setSettings] = useState<Record<string, string>>({});

  const fetchProject = () => {
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProject();
    fetch('/api/settings').then(res => res.json()).then(setSettings).catch(console.error);
    const likedProjects = JSON.parse(localStorage.getItem('liked_projects') || '[]');
    if (likedProjects.includes(id)) {
      setHasLiked(true);
    }
  }, [id]);

  const handleLike = async () => {
    if (isLiking || hasLiked) return;
    setIsLiking(true);
    try {
      const res = await fetch(`/api/projects/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setProject((prev: any) => ({ ...prev, likes: data.likes }));
        
        const likedProjects = JSON.parse(localStorage.getItem('liked_projects') || '[]');
        likedProjects.push(id);
        localStorage.setItem('liked_projects', JSON.stringify(likedProjects));
        setHasLiked(true);
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText, author: commentAuthor || 'Anonymous' })
      });
      if (res.ok) {
        setCommentText('');
        setCommentAuthor('');
        fetchProject(); // Refresh comments
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-mono transition-colors duration-300">
      <span className="animate-pulse">{t('hero.loading')}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-gray-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200 transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Spiral Logo Representation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 dark:opacity-10">
          <div className="absolute inset-0 rounded-full border-[40px] border-t-cyan-400 border-r-blue-500 border-b-purple-600 border-l-transparent animate-spin-slow blur-[8px]" />
          <div className="absolute inset-8 rounded-full border-[30px] border-t-transparent border-r-cyan-400 border-b-blue-500 border-l-purple-600 animate-spin-reverse-slow blur-[6px]" />
          <div className="absolute inset-16 rounded-full border-[20px] border-t-purple-600 border-r-transparent border-b-cyan-400 border-l-blue-500 animate-spin-slow blur-[4px]" />
        </div>

        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 dark:bg-blue-900/10 blur-[60px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-20 mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm font-mono mb-6">
              <Layers size={14} className="text-cyan-600 dark:text-cyan-400" /> Project ID: {project.id.split('-')[0]}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
              {project[`title_${i18n.language}`] || project.title}
            </h1>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="px-3 py-1.5 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-sm rounded-md font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.imageUrl && (
            <div className="w-full h-64 md:h-[500px] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 mb-12 relative group shadow-sm dark:shadow-none">
              <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-10" />
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
                loading="lazy"
              />
            </div>
          )}

          <div className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 mb-12 shadow-sm dark:shadow-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Terminal size={24} className="text-purple-600 dark:text-purple-400" /> {t('projects.overview')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed whitespace-pre-wrap mb-10">
              {project[`description_${i18n.language}`] || project.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200 dark:border-white/10">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-2">
                  <Github size={20} /> {t('projects.sourceCode')}
                </a>
              )}
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 text-white rounded-xl font-medium hover:from-cyan-500 hover:to-blue-600 dark:hover:from-cyan-400 dark:hover:to-blue-500 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <ExternalLink size={20} /> {t('projects.launch')}
                </a>
              )}
            </div>
          </div>

          {/* Interaction Section (Likes & Comments) */}
          <div className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare size={24} className="text-cyan-600 dark:text-cyan-400" /> {t('projects.feedback')}
              </h2>
              <button 
                onClick={handleLike}
                disabled={isLiking || hasLiked}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${hasLiked ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 cursor-not-allowed' : project.likes > 0 ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
              >
                <Heart size={20} className={hasLiked || project.likes > 0 ? "fill-red-500 dark:fill-red-400" : ""} /> 
                <span className="font-bold">{project.likes || 0}</span> {t('projects.likes')}
              </button>
            </div>

            <div className="space-y-8 mb-10">
              {project.comments?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{t('projects.noComments')}</p>
              ) : (
                project.comments?.map((comment: any) => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-900 dark:text-white">{comment.author}</span>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder={t('projects.namePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <textarea
                required
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t('projects.commentPlaceholder')}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none"
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="px-6 py-3 bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 rounded-xl font-medium hover:bg-cyan-100 dark:hover:bg-cyan-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('projects.posting') : t('projects.postComment')} <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
