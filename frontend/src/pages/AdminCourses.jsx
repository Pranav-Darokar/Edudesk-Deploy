import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { TrashIcon, BookOpenIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, courseId: null });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
            toast.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    // ... rest of the functions

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/courses', newCourse);
            setCourses([...courses, response.data]);
            setNewCourse({ title: '', description: '', duration: '' });
            setShowForm(false);
            toast.success("Course created successfully");
        } catch (error) {
            console.error("Failed to create course", error);
            toast.error("Failed to create course");
        }
    };

    const confirmDelete = async () => {
        if (!deleteModal.courseId) return;
        try {
            await api.delete(`/courses/${deleteModal.courseId}`);
            setCourses(courses.filter(course => course.id !== deleteModal.courseId));
            toast.success("Course deleted successfully");
        } catch (error) {
            console.error("Failed to delete course", error);
            toast.error("Failed to delete course");
        } finally {
            setDeleteModal({ isOpen: false, courseId: null });
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteModal({ isOpen: true, courseId: id });
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Management</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>{showForm ? 'Cancel' : 'New Course'}</span>
                    </button>
                </div>

                {/* Create Course Form */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Create New Course</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    type="text"
                                    value={newCourse.title}
                                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (hours)</label>
                                <input
                                    type="number"
                                    value={newCourse.duration}
                                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    Save Course
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Course List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                        <BookOpenIcon className="h-6 w-6" />
                                    </div>
                                    <button
                                        onClick={() => handleDeleteClick(course.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{course.description}</p>
                                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{course.duration} hours</span>
                                    {/* Edit button could go here */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, courseId: null })}
                onConfirm={confirmDelete}
                title="Delete Course"
                message="Are you sure you want to delete this course? This action cannot be undone."
            />
        </Layout>
    );
};

export default AdminCourses;
