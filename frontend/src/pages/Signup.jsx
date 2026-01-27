import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: '',
            dob: '',
            address: '',
            role: 'STUDENT',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
            phoneNumber: Yup.string().required('Required'),
            dob: Yup.string().required('Required'),
            address: Yup.string().required('Required'),
            role: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                await signup(values);
                toast.success('Registration successful! Welcome to EduDesk.');
                navigate('/');
            } catch (error) {
                toast.error(error.message || 'Signup failed. Try again.');
            }
        },
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-2xl w-full space-y-8 relative z-10">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30 mb-6 transition-transform hover:scale-110">
                        <AcademicCapIcon className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">EduDesk</h1>
                    <p className="mt-2 text-sm text-slate-500 font-medium">Create your profile and start learning.</p>
                </div>

                <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-100">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h2>
                        <p className="text-slate-500 text-sm mb-8">Join our community today.</p>
                    </div>

                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                    placeholder="Jane"
                                    {...formik.getFieldProps('firstName')}
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                    placeholder="Doe"
                                    {...formik.getFieldProps('lastName')}
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                    placeholder="jane@example.com"
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                    placeholder="+1 234 567 890"
                                    {...formik.getFieldProps('phoneNumber')}
                                />
                                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                    {...formik.getFieldProps('dob')}
                                />
                                {formik.touched.dob && formik.errors.dob && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.dob}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                    placeholder="••••••••"
                                    {...formik.getFieldProps('password')}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                            <textarea
                                rows="3"
                                className="block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                                placeholder="123 Street Name, City, Country"
                                {...formik.getFieldProps('address')}
                            ></textarea>
                            {formik.touched.address && formik.errors.address && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.address}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-600 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-bold transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

