import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Modal from '../components/Modal';
import api from '../services/api';
import { toast } from 'react-toastify';
import { ShieldCheckIcon, KeyIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success('Role updated successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/admin/users/${selectedUser.id}/reset-password`, { newPassword });
            toast.success(`Password reset for ${selectedUser.email}`);
            setIsPasswordModalOpen(false);
            setNewPassword('');
        } catch (error) {
            toast.error('Failed to reset password');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                toast.success('User deleted');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        {
            key: 'role',
            header: 'Role',
            render: (role, user) => (
                <select
                    value={role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-xs font-semibold rounded-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="STUDENT">STUDENT</option>
                    <option value="TEACHER">TEACHER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
            )
        },
    ];

    return (
        <Layout>
            <div className="sm:flex sm:items-center mb-8">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        View and manage all registered users, assign roles, and perform password resets.
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <Table
                    columns={columns}
                    data={users}
                    actions={false} // Custom actions below
                    renderActions={(user) => (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => { setSelectedUser(user); setIsPasswordModalOpen(true); }}
                                className="text-amber-600 hover:text-amber-900 px-2 py-1 flex items-center text-xs"
                            >
                                <KeyIcon className="h-3 w-3 mr-1" /> Reset
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 px-2 py-1 flex items-center text-xs"
                            >
                                <TrashIcon className="h-3 w-3 mr-1" /> Delete
                            </button>
                        </div>
                    )}
                />
            </div>

            {/* Manual actions column since Table.jsx base doesn't support custom render columns yet perfectly */}
            {/* Implementation note: Updated Table.jsx later or use custom rendering here */}
            {/* For now, I'll update Table.jsx to support custom row rendering if needed, or just add buttons to columns */}

            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Reset User Password"
            >
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <p className="text-sm text-gray-500">Resetting password for: <strong>{selectedUser?.email}</strong></p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="mt-5 flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            onClick={() => setIsPasswordModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700"
                        >
                            Confirm Reset
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default AdminUsers;
