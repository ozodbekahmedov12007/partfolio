import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Code2 } from 'lucide-react';

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ 
    name: '', 
    category: '', 
    category_uz: '', 
    category_ru: '', 
    percentage: 80 
  });

  const fetchSkills = async () => {
    const res = await fetch('/api/skills');
    if (res.ok) setSkills(await res.json());
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newSkill)
    });
    if (res.ok) {
      setIsAdding(false);
      setNewSkill({ 
        name: '', 
        category: '', 
        category_uz: '', 
        category_ru: '', 
        percentage: 80 
      });
      fetchSkills();
    } else {
      alert('Failed to add skill');
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/skills/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchSkills();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Skills</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={20} /> {isAdding ? 'Cancel' : 'Add New Skill'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Add New Skill</h3>
            <p className="text-sm text-gray-500 mt-1">Add a new technical skill to your portfolio.</p>
          </div>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Skill Name *</label>
                  <input required type="text" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="e.g. React, Node.js, Docker" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Proficiency (%) *</label>
                  <input required type="number" min="0" max="100" value={newSkill.percentage} onChange={e => setNewSkill({...newSkill, percentage: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="80" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category (EN) *</label>
                  <input required type="text" value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="e.g. Frontend" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category (UZ)</label>
                    <input type="text" value={newSkill.category_uz} onChange={e => setNewSkill({...newSkill, category_uz: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="e.g. Frontend" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category (RU)</label>
                    <input type="text" value={newSkill.category_ru} onChange={e => setNewSkill({...newSkill, category_ru: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="e.g. Frontend" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-8 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">Save Skill</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Skill Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Proficiency</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {skills.map((skill: any) => (
              <tr key={skill.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 font-bold text-gray-900">{skill.name}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                    skill.category.toLowerCase() === 'frontend' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    skill.category.toLowerCase() === 'backend' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {skill.category}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{skill.percentage}%</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Skill"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Code2 size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No skills found</p>
                    <p className="text-sm">Get started by adding your first skill.</p>
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
