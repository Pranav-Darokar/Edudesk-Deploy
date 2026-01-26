import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Cog6ToothIcon, ListBulletIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

const AdminSystem = () => {
    const [logs, setLogs] = useState([]);
    const [settings, setSettings] = useState({ siteName: '', version: '', footerText: '' });

    const fetchData = async () => {
        try {
            const [logRes, setRes] = await Promise.all([
                api.get('/admin/system/logs'),
                api.get('/admin/system/settings')
            ]);
            setLogs(logRes.data);
            setSettings(setRes.data);
        } catch (error) {
            toast.error('Failed to load system data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { key: 'timestamp', header: 'Timestamp', render: (t) => new Date(t).toLocaleString() },
        { key: 'username', header: 'User' },
        { key: 'action', header: 'Action' },
        { key: 'details', header: 'Details' },
    ];

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 font-display">System Management</h1>
                <p className="mt-2 text-sm text-gray-700">Audit logs and global system configurations.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                            <Cog6ToothIcon className="h-5 w-5 mr-2 text-primary" /> Global Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Site Name</label>
                                <input type="text" value={settings.siteName} readOnly className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">System Version</label>
                                <input type="text" value={settings.version} readOnly className="mt-1 block w-full bg-gray-50 border-gray-200 rounded-lg text-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
                        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                            <ListBulletIcon className="h-5 w-5 mr-2 text-primary" /> Activity Audit Log
                        </h2>
                        <Table
                            columns={columns}
                            data={logs}
                            actions={false}
                        />
                        {logs.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <ShieldExclamationIcon className="h-12 w-12 mb-2 opacity-20" />
                                <p>No logs recorded yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminSystem;
