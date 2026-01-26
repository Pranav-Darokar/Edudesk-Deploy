import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                await api.post('/auth/forgot-password', { email: values.email });
                setIsEmailSent(true);
                toast.success('Reset link sent to your email!');
            } catch (error) {
                toast.error('Failed to send reset link. User not found?');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>
                {!isEmailSent ? (
                    <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Email address"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                            ) : null}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-primary hover:bg-indigo-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-8 text-center bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 font-medium">Check your inbox!</p>
                        <p className="text-green-700 text-sm mt-1">
                            An email has been sent to <strong>{formik.values.email}</strong>.
                        </p>
                    </div>
                )}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-indigo-500">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
