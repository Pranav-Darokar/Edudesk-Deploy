import React from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { toast } from 'react-toastify';
import { DocumentArrowDownIcon, TableCellsIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const AdminReports = () => {

    const downloadReport = async (endpoint, filename) => {
        try {
            const response = await api.get(endpoint, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to download report');
        }
    };

    const reportCards = [
        {
            title: 'Student Directory',
            description: 'Export all registered students with contact details.',
            format: 'Excel (.xlsx)',
            icon: TableCellsIcon,
            color: 'bg-green-100 text-green-700',
            action: () => downloadReport('/admin/reports/students/excel', 'students_directory.xlsx')
        },
        {
            title: 'Fees Collection',
            description: 'Consolidated report of all payments received.',
            format: 'PDF Document',
            icon: DocumentArrowDownIcon,
            color: 'bg-blue-100 text-blue-700',
            action: () => downloadReport('/admin/reports/fees/pdf', 'fees_collection.pdf')
        },
        {
            title: 'Academic Summary',
            description: 'Overview of exam results and pass percentages.',
            format: 'Excel (.xlsx)',
            icon: ChartBarIcon,
            color: 'bg-indigo-100 text-indigo-700',
            action: () => toast.info('Coming soon in next update!')
        }
    ];

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
                <p className="mt-2 text-sm text-gray-700">Generate and download official school reports.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                {reportCards.map((card) => (
                    <div key={card.title} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                                    <card.icon className="h-6 w-6" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                                    <p className="text-sm text-gray-500">{card.format}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">{card.description}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3 flex justify-end transition-colors duration-200 hover:bg-indigo-50 group">
                            <button
                                onClick={card.action}
                                className="text-sm font-medium text-primary hover:text-indigo-800 flex items-center"
                            >
                                Generate Report
                                <DocumentArrowDownIcon className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default AdminReports;
