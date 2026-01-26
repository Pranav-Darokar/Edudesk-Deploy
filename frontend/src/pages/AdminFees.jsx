import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Modal from '../components/Modal';
import api from '../services/api';
import { toast } from 'react-toastify';
import { CurrencyDollarIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminFees = () => {
    const [structures, setStructures] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
    const [newStructure, setNewStructure] = useState({ className: '', amount: '', description: '' });

    const fetchData = async () => {
        try {
            const [structRes, payRes] = await Promise.all([
                api.get('/admin/fees/structures'),
                api.get('/admin/fees/payments')
            ]);
            setStructures(structRes.data);
            setPayments(payRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateStructure = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/fees/structures', newStructure);
            toast.success('Fee structure created');
            setIsStructureModalOpen(false);
            setNewStructure({ className: '', amount: '', description: '' });
            fetchData();
        } catch (error) {
            toast.error('Failed to create structure');
        }
    };

    const handleDeleteStructure = async (id) => {
        if (window.confirm('Delete this structure?')) {
            try {
                await api.delete(`/admin/fees/structures/${id}`);
                toast.success('Structure removed');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const columns = [
        { key: 'className', header: 'Class/Grade' },
        { key: 'amount', header: 'Amount ($)' },
        { key: 'description', header: 'Description' },
    ];

    const paymentColumns = [
        { key: 'id', header: 'ID' },
        { key: 'student', header: 'Student', render: (s) => s?.name || 'Unknown' },
        { key: 'amountPaid', header: 'Paid ($)' },
        { key: 'paymentMethod', header: 'Method' },
        { key: 'paymentDate', header: 'Date', render: (d) => new Date(d).toLocaleDateString() },
    ];

    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <div className="sm:flex sm:items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Fees Structure</h1>
                            <p className="mt-2 text-sm text-gray-700">Define fee structures by class or level.</p>
                        </div>
                        <button
                            onClick={() => setIsStructureModalOpen(true)}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" /> Add Structure
                        </button>
                    </div>
                    <Table
                        columns={columns}
                        data={structures}
                        onEdit={() => { }}
                        onDelete={handleDeleteStructure}
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Payments</h2>
                    <Table
                        columns={paymentColumns}
                        data={payments}
                        actions={false}
                    />
                </div>
            </div>

            <Modal
                isOpen={isStructureModalOpen}
                onClose={() => setIsStructureModalOpen(false)}
                title="Create Fee Structure"
            >
                <form onSubmit={handleCreateStructure} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Class Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            value={newStructure.className}
                            onChange={(e) => setNewStructure({ ...newStructure, className: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Amount</label>
                        <input
                            type="number"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            value={newStructure.amount}
                            onChange={(e) => setNewStructure({ ...newStructure, amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            className="mt-1 block w-full border rounded-md p-2"
                            value={newStructure.description}
                            onChange={(e) => setNewStructure({ ...newStructure, description: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsStructureModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default AdminFees;
