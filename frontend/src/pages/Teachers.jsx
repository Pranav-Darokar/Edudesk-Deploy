import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Modal from '../components/Modal';
import api from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Teachers = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const [teachers, setTeachers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);

    const fetchTeachers = async (currentPage = 0) => {
        try {
            const response = await api.get(`/teachers?page=${currentPage}&size=10`);
            setTeachers(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    useEffect(() => {
        fetchTeachers(page);
    }, [page]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            try {
                await api.delete(`/teachers/${id}`);
                toast.success('Teacher deleted successfully');
                fetchTeachers();
            } catch (error) {
                toast.error('Failed to delete teacher');
            }
        }
    };

    const handleEdit = (teacher) => {
        setCurrentTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentTeacher(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTeacher(null);
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: currentTeacher ? currentTeacher.name : '',
            email: currentTeacher ? currentTeacher.email : '',
            subject: currentTeacher ? currentTeacher.subject : '',
            experience: currentTeacher ? currentTeacher.experience : '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            subject: Yup.string().required('Required'),
            experience: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                if (currentTeacher) {
                    await api.put(`/teachers/${currentTeacher.id}`, values);
                    toast.success('Teacher updated successfully');
                } else {
                    await api.post('/teachers', values);
                    toast.success('Teacher added successfully');
                }
                closeModal();
                fetchTeachers();
            } catch (error) {
                toast.error('Operation failed');
            }
        },
    });

    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'subject', header: 'Subject' },
        { key: 'experience', header: 'Experience' },
    ];

    return (
        <Layout>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Teachers</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the teachers in the system including their name, email, subject, and experience.
                    </p>
                </div>
                {isAdmin && (
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            Add Teacher
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <Table
                    columns={columns}
                    data={teachers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showDelete={isAdmin}
                />

                {/* Pagination Controls */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Page <span className="font-medium">{page + 1}</span> of <span className="font-medium">{totalPages}</span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={currentTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            >
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            {...formik.getFieldProps('name')}
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            id="subject"
                            name="subject"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            {...formik.getFieldProps('subject')}
                        />
                        {formik.touched.subject && formik.errors.subject ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.subject}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
                        <input
                            id="experience"
                            name="experience"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            {...formik.getFieldProps('experience')}
                        />
                        {formik.touched.experience && formik.errors.experience ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.experience}</div>
                        ) : null}
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        >
                            {currentTeacher ? 'Save Changes' : 'Create Teacher'}
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Teachers;
