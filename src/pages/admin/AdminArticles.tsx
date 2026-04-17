import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Check, X } from 'lucide-react';

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState({ 
    title: '', 
    title_uz: '', 
    title_ru: '', 
    content: '', 
    content_uz: '', 
    content_ru: '', 
    published: false 
  });

  const fetchArticles = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/articles/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setArticles(await res.json());
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editingId ? `/api/articles/${editingId}` : '/api/articles';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newArticle)
    });
    if (res.ok) {
      setIsAdding(false);
      setEditingId(null);
      setNewArticle({ 
        title: '', 
        title_uz: '', 
        title_ru: '', 
        content: '', 
        content_uz: '', 
        content_ru: '', 
        published: false 
      });
      fetchArticles();
    } else {
      alert('Failed to save article');
    }
  };

  const handleEdit = (article: any) => {
    setEditingId(article.id);
    setNewArticle({
      title: article.title || '',
      title_uz: article.title_uz || '',
      title_ru: article.title_ru || '',
      content: article.content || '',
      content_uz: article.content_uz || '',
      content_ru: article.content_ru || '',
      published: article.published || false
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ published: !currentStatus })
    });
    if (res.ok) fetchArticles();
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchArticles();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Articles</h2>
        <button onClick={() => {
          if (isAdding) {
            setIsAdding(false);
            setEditingId(null);
            setNewArticle({ title: '', title_uz: '', title_ru: '', content: '', content_uz: '', content_ru: '', published: false });
          } else {
            setIsAdding(true);
          }
        }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={20} /> {isAdding ? 'Cancel' : 'Write Article'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Article' : 'Write New Article'}</h3>
            <p className="text-sm text-gray-500 mt-1">{editingId ? 'Update your existing article.' : 'Share your knowledge with the world.'}</p>
          </div>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title (EN) *</label>
                <input required type="text" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="Article Title" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title (UZ)</label>
                <input type="text" value={newArticle.title_uz} onChange={e => setNewArticle({...newArticle, title_uz: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="Maqola sarlavhasi" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title (RU)</label>
                <input type="text" value={newArticle.title_ru} onChange={e => setNewArticle({...newArticle, title_ru: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="Заголовок статьи" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content (EN) *</label>
                <textarea required rows={5} value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm" placeholder="Write your article here..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content (UZ)</label>
                  <textarea rows={5} value={newArticle.content_uz} onChange={e => setNewArticle({...newArticle, content_uz: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm" placeholder="Maqola matni..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content (RU)</label>
                  <textarea rows={5} value={newArticle.content_ru} onChange={e => setNewArticle({...newArticle, content_ru: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm" placeholder="Текст статьи..." />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" checked={newArticle.published} onChange={e => setNewArticle({...newArticle, published: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish immediately</label>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setNewArticle({ title: '', title_uz: '', title_ru: '', content: '', content_uz: '', content_ru: '', published: false });
              }} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-8 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">{editingId ? 'Update Article' : 'Save Article'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Views</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article: any) => (
              <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 font-bold text-gray-900">{article.title}</td>
                <td className="px-6 py-5">
                  <button 
                    onClick={() => handleTogglePublish(article.id, article.published)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1 w-max ${
                      article.published ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100'
                    }`}
                  >
                    {article.published ? <Check size={12} /> : <X size={12} />}
                    {article.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-6 py-5 text-sm text-gray-500">{article.views}</td>
                <td className="px-6 py-5 text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-5 text-right space-x-2">
                  <button onClick={() => handleEdit(article)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Article"><Plus size={18} className="rotate-45" /></button>
                  <button onClick={() => handleDelete(article.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Article"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No articles found</p>
                    <p className="text-sm">Start writing to share your thoughts.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
