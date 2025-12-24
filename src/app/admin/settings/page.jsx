'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Mail } from 'lucide-react';

export default function SettingsPage() {
    const [emails, setEmails] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.success) {
                setEmails(data.settings.orderNotificationEmails || []);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            // alert('Failed to load settings');
            // Silent fail on load is better than annoying alert on page load if it's just empty
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmail = async (e) => {
        e.preventDefault();
        if (!newEmail) return;

        // Basic validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            alert('Please enter a valid email address');
            return;
        }

        if (emails.includes(newEmail)) {
            alert('Email already added');
            return;
        }

        const updatedEmails = [...emails, newEmail];
        setEmails(updatedEmails);
        setNewEmail('');
        await saveSettings(updatedEmails);
    };

    const handleRemoveEmail = async (emailToRemove) => {
        if (!confirm('Are you sure you want to remove this email?')) return;
        const updatedEmails = emails.filter(email => email !== emailToRemove);
        setEmails(updatedEmails);
        await saveSettings(updatedEmails);
    };

    const saveSettings = async (updatedEmails) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emails: updatedEmails })
            });
            const data = await res.json();
            if (data.success) {
                // Optional: alert('Settings saved successfully');
            } else {
                alert('Failed to save settings');
                // Revert UI if needed, but for simple list it's okay often
            }
        } catch (error) {
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5d1e]"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-[#3a5d1e]">Global Settings</h1>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#3a5d1e]" />
                    Order Notification Recipients
                </h2>
                <p className="text-gray-500 mb-6 text-sm">
                    Add email addresses that should receive notifications when a new order is placed.
                    These emails will receive an alert with order details immediately after a successful order.
                </p>

                <form onSubmit={handleAddEmail} className="flex gap-2 mb-6">
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3a5d1e] focus:border-transparent transition-all"
                    />
                    <button
                        type="submit"
                        disabled={saving || !newEmail}
                        className="bg-[#3a5d1e] text-white px-6 py-2 rounded-lg hover:bg-[#2e4a18] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </form>

                <div className="space-y-3">
                    {emails.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <Mail className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-400">No admin emails added yet</p>
                        </div>
                    ) : (
                        emails.map((email) => (
                            <div key={email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                                <span className="text-gray-700 font-medium">{email}</span>
                                <button
                                    onClick={() => handleRemoveEmail(email)}
                                    disabled={saving}
                                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                    title="Remove email"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
