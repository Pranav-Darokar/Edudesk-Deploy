import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Modal from '../components/Modal';
import api from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
    const { user } = useAuth(); // Helper to access user state
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            // toast.error('Failed to load courses');
        }
    };

    const fetchEnrolledCourses = async () => {
        if (user?.role === 'STUDENT') {
            try {
                const response = await api.get('/enrollments/my-courses');
                const ids = new Set(response.data.map(course => course.id));
                setEnrolledCourseIds(ids);
            } catch (error) {
                console.error('Error fetching enrollments:', error);
            }
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchEnrolledCourses();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/${id}`);
                toast.success('Course deleted successfully');
                fetchCourses();
            } catch (error) {
                toast.error('Failed to delete course');
            }
        }
    };

    const handleEnroll = async (id) => {
        try {
            await api.post(`/enrollments/${id}`);
            toast.success('Enrolled successfully');
            fetchEnrolledCourses(); // Refresh enrollment status
        } catch (error) {
            toast.error(error.response?.data || 'Enrollment failed');
        }
    };

    const handleEdit = (course) => {
        setCurrentCourse(course);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentCourse(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCourse(null);
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: currentCourse ? currentCourse.title : '',
            description: currentCourse ? currentCourse.description : '',
            duration: currentCourse ? currentCourse.duration : '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Required'),
            description: Yup.string().required('Required'),
            duration: Yup.number().required('Required').positive('Must be positive').integer('Must be an integer'),
        }),
        onSubmit: async (values) => {
            try {
                if (currentCourse) {
                    await api.put(`/courses/${currentCourse.id}`, values);
                    toast.success('Course updated successfully');
                } else {
                    await api.post('/courses', values);
                    toast.success('Course added successfully');
                }
                closeModal();
                fetchCourses();
            } catch (error) {
                toast.error('Operation failed');
            }
        },
    });

    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'title', header: 'Title' },
        { key: 'description', header: 'Description' },
        { key: 'duration', header: 'Duration (Weeks)' },
    ];

    return (
        <Layout>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the courses available including title, description, and duration.
                    </p>
                </div>
                {user?.role !== 'STUDENT' && (
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            Add Course
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8">
                {user?.role === 'STUDENT' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => {
                            const isEnrolled = enrolledCourseIds.has(course.id);
                            return (
                                <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                                    <div className={`h-2 bg-gradient-to-r ${isEnrolled ? 'from-green-400 to-emerald-500' : 'from-indigo-400 to-purple-500'}`}></div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1" title={course.title}>
                                                {course.title}
                                            </h4>
                                            {isEnrolled && (
                                                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full shrink-0">
                                                    Enrolled
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="text-xs text-gray-400 font-medium flex items-center">
                                                <span className="mr-1">🕒</span> {course.duration} Weeks
                                            </div>
                                            {isEnrolled ? (
                                                <button disabled className="text-green-600 font-semibold text-sm cursor-default flex items-center">
                                                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                                                    Enrolled
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEnroll(course.id)}
                                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                                                >
                                                    Enroll Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={courses}
                        onEdit={user?.role !== 'STUDENT' ? handleEdit : undefined}
                        onDelete={user?.role !== 'STUDENT' ? handleDelete : undefined}
                        renderActions={undefined}
                    />
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={currentCourse ? 'Edit Course' : 'Add New Course'}
            >
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            {...formik.getFieldProps('title')}
                        />
                        {formik.touched.title && formik.errors.title ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            {...formik.getFieldProps('description')}
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (Weeks)</label>
                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            {...formik.getFieldProps('duration')}
                        />
                        {formik.touched.duration && formik.errors.duration ? (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.duration}</div>
                        ) : null}
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        >
                            {currentCourse ? 'Save Changes' : 'Create Course'}
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

export default Courses;
