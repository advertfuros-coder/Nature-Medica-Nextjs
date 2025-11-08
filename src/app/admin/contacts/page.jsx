'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, MessageSquare } from 'lucide-react';

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
      
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-white rounded-lg border p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{msg.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {msg.email}
                  </span>
                  {msg.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {msg.phone}
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(msg.status)}`}>
                {msg.status}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Subject: {msg.subject}</p>
              <p className="text-gray-600">{msg.message}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {new Date(msg.createdAt).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
