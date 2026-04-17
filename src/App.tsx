/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Public Pages
import PortfolioHome from './pages/public/PortfolioHome';
import ProjectDetails from './pages/public/ProjectDetails';
import ArticleDetails from './pages/public/ArticleDetails';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProjects from './pages/admin/AdminProjects';
import AdminSkills from './pages/admin/AdminSkills';
import AdminSocials from './pages/admin/AdminSocials';
import AdminMessages from './pages/admin/AdminMessages';
import AdminArticles from './pages/admin/AdminArticles';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/article/:id" element={<ArticleDetails />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="socials" element={<AdminSocials />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

