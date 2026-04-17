import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Github, Image as ImageIcon, FolderKanban } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    title_uz: '',
    title_ru: '',
    description: '',
    description_uz: '',
    description_ru: '',
    techStack: '',
    githubLink: '',
    liveLink: '',
    imageUrl: ''
  });

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProject({ ...newProject, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    // Convert comma separated string to array
    const techStackArray = newProject.techStack.split(',').map(s => s.trim()).filter(Boolean);

    const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newProject,
        techStack: techStackArray
      })
    });

    if (res.ok) {
      setIsAdding(false);
      setEditingId(null);
      setNewProject({ 
        title: '', 
        title_uz: '', 
        title_ru: '', 
        description: '', 
        description_uz: '', 
        description_ru: '', 
        techStack: '', 
        githubLink: '', 
        liveLink: '', 
        imageUrl: '' 
      });
      fetchProjects();
    } else {
      alert('Failed to save project');
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setNewProject({
      title: project.title || '',
      title_uz: project.title_uz || '',
      title_ru: project.title_ru || '',
      description: project.description || '',
      description_uz: project.description_uz || '',
      description_ru: project.description_ru || '',
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack || '',
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      imageUrl: project.imageUrl || ''
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      fetchProjects();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Projects</h2>
        <button 
          onClick={() => {
            if (isAdding) {
              setIsAdding(false);
              setEditingId(null);
              setNewProject({ title: '', title_uz: '', title_ru: '', description: '', description_uz: '', description_ru: '', techStack: '', githubLink: '', liveLink: '', imageUrl: '' });
            } else {
              setIsAdding(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} /> {isAdding ? 'Cancel' : 'Add New Project'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Project' : 'Create New Project'}</h3>
            <p className="text-sm text-gray-500 mt-1">{editingId ? 'Update your existing project details.' : 'Fill in the details below to add a new project to your portfolio.'}</p>
          </div>
          
          <form onSubmit={handleAddProject} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title (EN) *</label>
                  <input required type="text" placeholder="e.g. E-Commerce Platform" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title (UZ)</label>
                    <input type="text" placeholder="Loyiha nomi" value={newProject.title_uz} onChange={e => setNewProject({...newProject, title_uz: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title (RU)</label>
                    <input type="text" placeholder="Название проекта" value={newProject.title_ru} onChange={e => setNewProject({...newProject, title_ru: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tech Stack *</label>
                  <input required type="text" placeholder="e.g. React, Node.js, Tailwind CSS" value={newProject.techStack} onChange={e => setNewProject({...newProject, techStack: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
                  <p className="text-xs text-gray-500 mt-1">Separate technologies with commas.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Project Image</label>
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
                  </div>
                  {newProject.imageUrl && (
                    <div className="mt-2">
                      <img src={newProject.imageUrl} alt="Preview" className="h-20 w-auto rounded-md object-cover border border-gray-200" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">GitHub Link</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Github size={18} className="text-gray-400" />
                      </div>
                      <input type="url" placeholder="https://github.com/..." value={newProject.githubLink} onChange={e => setNewProject({...newProject, githubLink: e.target.value})} className="w-full pl-10 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Live Demo Link</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ExternalLink size={18} className="text-gray-400" />
                      </div>
                      <input type="url" placeholder="https://..." value={newProject.liveLink} onChange={e => setNewProject({...newProject, liveLink: e.target.value})} className="w-full pl-10 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description (EN) *</label>
                <textarea required rows={3} placeholder="Describe what the project does..." value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description (UZ)</label>
                  <textarea rows={3} placeholder="Loyiha haqida qisqacha..." value={newProject.description_uz} onChange={e => setNewProject({...newProject, description_uz: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description (RU)</label>
                  <textarea rows={3} placeholder="Краткое описание проекта..." value={newProject.description_ru} onChange={e => setNewProject({...newProject, description_ru: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button type="button" onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setNewProject({ title: '', title_uz: '', title_ru: '', description: '', description_uz: '', description_ru: '', techStack: '', githubLink: '', liveLink: '', imageUrl: '' });
              }} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg mr-3 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-8 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                {editingId ? 'Update Project' : 'Publish Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Project Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tech Stack</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Links</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {projects.map((project: any) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    {project.imageUrl ? (
                      <img className="h-12 w-12 rounded-lg object-cover mr-4 border border-gray-200 shadow-sm" src={project.imageUrl} alt="" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4 border border-gray-200 text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs mt-0.5">{project.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 3).map((tech: string) => (
                      <span key={tech} className="px-2.5 py-1 text-[11px] font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-100">{tech}</span>
                    ))}
                    {project.techStack.length > 3 && <span className="px-2.5 py-1 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-md border border-gray-200">+{project.techStack.length - 3}</span>}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-3 text-gray-400">
                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-gray-100 rounded-md hover:text-gray-900 transition-colors" title="GitHub Repository"><Github size={18} /></a>}
                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-gray-100 rounded-md hover:text-blue-600 transition-colors" title="Live Demo"><ExternalLink size={18} /></a>}
                  </div>
                </td>
                <td className="px-6 py-5 text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(project)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Project">
                    <Plus size={18} className="rotate-45" />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Project">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <FolderKanban size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No projects found</p>
                    <p className="text-sm">Get started by adding your first project.</p>
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
