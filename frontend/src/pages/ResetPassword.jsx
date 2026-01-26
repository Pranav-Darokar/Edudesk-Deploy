import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(6, 'Must be at least 6 characters')
                .required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: async (values) => {
            if (!token) {
                toast.error('Invalid or missing reset token');
                return;
            }
            setIsSubmitting(true);
            try {
                await api.post('/auth/reset-password', {
                    token,
                    newPassword: values.newPassword,
                });
                toast.success('Password reset successfully! Please login.');
                navigate('/login');
            } catch (error) {
                toast.error('Failed to reset password. Link may be expired.');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600">Invalid Link</h2>
                    <p className="mt-4 text-gray-600">This password reset link is invalid or has expired.</p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="mt-6 text-primary font-medium hover:underline"
                    >
                        Request a new link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Set New Password
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="New Password"
                                {...formik.getFieldProps('newPassword')}
                            />
                            {formik.touched.newPassword && formik.errors.newPassword ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.newPassword}</div>
                            ) : null}
                        </div>
                        <div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Confirm New Password"
                                {...formik.getFieldProps('confirmPassword')}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-primary hover:bg-indigo-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out`}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
