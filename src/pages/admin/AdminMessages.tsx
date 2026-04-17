import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, Circle } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/messages', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setMessages(await res.json());
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkRead = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/messages/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchMessages();
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchMessages();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {messages.map((msg: any) => (
            <div key={msg.id} className={`p-6 transition-colors ${msg.read ? 'bg-white' : 'bg-blue-50/50'}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`font-bold ${msg.read ? 'text-gray-900' : 'text-blue-900'}`}>{msg.name}</h3>
                    <span className="text-sm text-gray-500">&lt;{msg.email}&gt;</span>
                    <span className="text-xs text-gray-400 ml-auto">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className={`text-sm mt-2 ${msg.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                    {msg.message}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!msg.read && (
                    <button onClick={() => handleMarkRead(msg.id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Mark as read">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete message">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Mail size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium text-gray-900 mb-1">No messages yet</p>
                <p className="text-sm">When someone contacts you, their message will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
