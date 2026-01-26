import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                await login(values.email, values.password);
                toast.success('Login successful!');
                navigate('/dashboard');
            } catch (error) {
                toast.error('Invalid email or password');
            }
        },
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30 mb-6 group transition-transform hover:scale-110">
                        <AcademicCapIcon className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">EduDesk</h1>
                    <p className="mt-2 text-sm text-slate-500 font-medium">Empowering Education, Simplified.</p>
                </div>

                <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-100">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                        <p className="text-slate-500 text-sm mb-8">Please enter your details to sign in.</p>
                    </div>

                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.email}</div>
                                ) : null}
                            </div>
                            <div>
                                <label htmlFor="password" title="password" className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    {...formik.getFieldProps('password')}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.password}</div>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link to="/forgot-password"
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-600 font-medium">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-bold transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
