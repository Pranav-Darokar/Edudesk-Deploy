import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Modal from '../components/Modal';
import api from '../services/api';
import { toast } from 'react-toastify';
import { CalendarIcon, PlusIcon, ClipboardDocumentCheckIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

const AdminExams = () => {
    const [exams, setExams] = useState([]);
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [newExam, setNewExam] = useState({ title: '', subject: '', examDate: '', durationMinutes: '', totalMarks: '' });

    const fetchExams = async () => {
        try {
            const response = await api.get('/exams');
            setExams(response.data);
        } catch (error) {
            toast.error('Failed to load exams');
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleCreateOrUpdateExam = async (e) => {
        e.preventDefault();
        try {
            if (editingExam) {
                await api.put(`/exams/${editingExam.id}`, newExam);
                toast.success('Exam updated successfully');
            } else {
                await api.post('/exams', newExam);
                toast.success('Exam scheduled successfully');
            }
            setIsExamModalOpen(false);
            setNewExam({ title: '', subject: '', examDate: '', durationMinutes: '', totalMarks: '' });
            setEditingExam(null);
            fetchExams();
        } catch (error) {
            toast.error(editingExam ? 'Failed to update exam' : 'Failed to schedule exam');
        }
    };

    const handleEdit = (exam) => {
        setEditingExam(exam);
        setNewExam({
            title: exam.title,
            subject: exam.subject,
            examDate: exam.examDate,
            durationMinutes: exam.durationMinutes,
            totalMarks: exam.totalMarks
        });
        setIsExamModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await api.delete(`/exams/${id}`);
                toast.success('Exam deleted successfully');
                fetchExams();
            } catch (error) {
                toast.error('Failed to delete exam');
            }
        }
    };

    const handlePublishResults = async (examId) => {
        try {
            await api.patch(`/exams/${examId}/publish`);
            toast.success('Results published to student portal');
            fetchExams();
        } catch (error) {
            toast.error('Failed to publish results');
        }
    };

    const columns = [
        { key: 'title', header: 'Exam Title' },
        { key: 'subject', header: 'Subject' },
        { key: 'examDate', header: 'Date', render: (d) => new Date(d).toLocaleString() },
        { key: 'totalMarks', header: 'Total Marks' },
    ];

    const openModal = () => {
        setEditingExam(null);
        setNewExam({ title: '', subject: '', examDate: '', durationMinutes: '', totalMarks: '' });
        setIsExamModalOpen(true);
    };

    return (
        <Layout>
            <div className="sm:flex sm:items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Exam Management</h1>
                    <p className="mt-2 text-sm text-gray-700">Schedule exams and publish results.</p>
                </div>
                <button
                    onClick={openModal}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                >
                    <PlusIcon className="h-5 w-5 mr-2" /> Schedule Exam
                </button>
            </div>

            <div className="mt-8">
                <Table
                    columns={columns}
                    data={exams}
                    onEdit={handleEdit}
                    onDelete={(exam) => handleDelete(exam.id)}
                    showEdit={true}
                    showDelete={true}
                    renderActions={(exam) => (
                        <div className="flex space-x-2 justify-end">
                            <button
                                onClick={() => handlePublishResults(exam.id)}
                                className="text-green-600 hover:text-green-900 px-2 py-1 flex items-center text-xs border border-green-600 rounded"
                            >
                                <MegaphoneIcon className="h-3 w-3 mr-1" /> Publish
                            </button>
                        </div>
                    )}
                />
            </div>

            <Modal
                isOpen={isExamModalOpen}
                onClose={() => setIsExamModalOpen(false)}
                title={editingExam ? "Update Exam" : "Schedule New Exam"}
            >
                <form onSubmit={handleCreateOrUpdateExam} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            value={newExam.title}
                            onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Subject</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border rounded-md p-2"
                                value={newExam.subject}
                                onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Total Marks</label>
                            <input
                                type="number"
                                required
                                className="mt-1 block w-full border rounded-md p-2"
                                value={newExam.totalMarks}
                                onChange={(e) => setNewExam({ ...newExam, totalMarks: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Date & Time</label>
                        <input
                            type="datetime-local"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            value={newExam.examDate}
                            onChange={(e) => setNewExam({ ...newExam, examDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Duration (Minutes)</label>
                        <input
                            type="number"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            value={newExam.durationMinutes}
                            onChange={(e) => setNewExam({ ...newExam, durationMinutes: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={() => setIsExamModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
                            {editingExam ? "Save Changes" : "Schedule"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default AdminExams;
