import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const VerifyOTP = () => {
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        // Focus next
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length < 6) {
            toast.warn('Please enter the full 6-digit code');
            return;
        }

        try {
            await verifyOtp(email, otpString);
            toast.success('Email verified successfully! You can now login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Invalid OTP');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30 mb-6 transition-transform hover:scale-110">
                        <ShieldCheckIcon className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Verify Email</h1>
                    <p className="mt-2 text-sm text-slate-500 font-medium">We've sent a 6-digit code to {email}</p>
                </div>

                <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex justify-between gap-2">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-colors"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
                        >
                            Verify Account
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-600">
                            Didn't receive code?{' '}
                            <button className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors">
                                Resend OTP
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
