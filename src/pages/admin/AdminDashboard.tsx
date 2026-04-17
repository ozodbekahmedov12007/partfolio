import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalArticles: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalProjectViews: 0,
    totalProjectLikes: 0,
    totalComments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={stats.totalProjects} />
        <StatCard title="Project Views" value={stats.totalProjectViews} />
        <StatCard title="Project Likes" value={stats.totalProjectLikes} />
        <StatCard title="Total Comments" value={stats.totalComments} />
        <StatCard title="Total Messages" value={stats.totalMessages} subtitle={`${stats.unreadMessages} unread`} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <Link to="/admin/projects" className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
            Manage Projects
          </Link>
          <Link to="/admin/skills" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Manage Skills
          </Link>
          <Link to="/admin/settings" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Portfolio Settings
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Note: Full CRUD functionality for Projects, Skills, and Social Links is now available.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }: { title: string, value: number, subtitle?: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-xs text-blue-600 mt-2 font-medium">{subtitle}</div>}
    </div>
  );
}
