import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

export default function AdminSocials() {
  const [socials, setSocials] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newSocial, setNewSocial] = useState({ platform: 'GitHub', url: '' });

  const fetchSocials = async () => {
    const res = await fetch('/api/socials');
    if (res.ok) setSocials(await res.json());
  };

  useEffect(() => { fetchSocials(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/socials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newSocial)
    });
    if (res.ok) {
      setIsAdding(false);
      setNewSocial({ platform: 'GitHub', url: '' });
      fetchSocials();
    } else {
      alert('Failed to add social link');
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/socials/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchSocials();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Social Links</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={20} /> {isAdding ? 'Cancel' : 'Add New Link'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Add Social Link</h3>
            <p className="text-sm text-gray-500 mt-1">Add a link to your social media profiles.</p>
          </div>
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Platform *</label>
              <select value={newSocial.platform} onChange={e => setNewSocial({...newSocial, platform: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none">
                <option value="GitHub">GitHub</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter / X</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex-[2] w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL *</label>
              <input required type="url" value={newSocial.url} onChange={e => setNewSocial({...newSocial, url: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="https://..." />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors w-full md:w-auto">Cancel</button>
              <button type="submit" className="px-8 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm w-full md:w-auto">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Platform</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">URL</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {socials.map((social: any) => (
              <tr key={social.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 font-bold text-gray-900">{social.platform}</td>
                <td className="px-6 py-5 text-blue-600 hover:underline"><a href={social.url} target="_blank" rel="noreferrer">{social.url}</a></td>
                <td className="px-6 py-5 text-right">
                  <button onClick={() => handleDelete(social.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Link"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {socials.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <LinkIcon size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No social links found</p>
                    <p className="text-sm">Get started by adding your first social link.</p>
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
