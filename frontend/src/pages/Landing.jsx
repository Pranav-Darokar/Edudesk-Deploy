import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    UserGroupIcon,
    AcademicCapIcon,
    CurrencyDollarIcon,
    ClipboardDocumentCheckIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import Logo from '../components/Logo';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/20">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Logo className="w-8 h-8" />
                        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="hover:text-indigo-600 transition-colors">Login</Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
                {/* Mesh Gradient / Decorative Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-blue-100/30 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-8 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span>Now in Public Beta</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
                            Education Management
                        </span>
                        <br />
                        <span className="text-slate-900">Redefined.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
                        Streamline your institution's operations with our all-in-one platform for students,
                        teachers, and administrators. Premium design meets powerful functionality.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        {user ? (
                            <Link
                                to="/dashboard"
                                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center group"
                            >
                                Continue to Dashboard
                                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/signup"
                                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center group"
                                >
                                    Get Started Free
                                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-center shadow-sm"
                                >
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">Powerful Features</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Everything you need to run your school efficiently, all in one place.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Student Management', desc: 'Track students, profiles, and academic records effortlessly.', icon: UserGroupIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { title: 'Teacher Portals', desc: 'Comprehensive dashboards for faculty to manage courses.', icon: AcademicCapIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { title: 'Fee Tracking', desc: 'Automated billing and payment tracking with reporting.', icon: CurrencyDollarIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { title: 'Exam Control', desc: 'Schedule exams and manage results with ease.', icon: ClipboardDocumentCheckIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
                                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">About EduDesk</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Empowering institutions with cutting-edge digital tools for a brighter educational future.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
                        <div className="space-y-6">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <span className="text-white font-bold">M</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">Our Mission</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                To revolutionize school management by delivering an intuitive, secure, and
                                integrated platform that simplifies administrative complexity and enhances the learning experience.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                                <span className="text-white font-bold">V</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">Our Vision</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                To become the global standard for educational administration, fostering an environment where technology and teaching work in perfect harmony.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Simplicity', desc: 'Powerful tools don\'t have to be complicated. We prioritize an intuitive user experience.', icon: '💡', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { title: 'Security', desc: 'Student and staff data is critical. We use industry-standard encryption and protocols.', icon: '🔒', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { title: 'Innovation', desc: 'We continuously evolve, integrating the latest technologies to solve educational challenges.', icon: '🚀', color: 'text-purple-600', bg: 'bg-purple-50' },
                        ].map((value, idx) => (
                            <div key={idx} className="p-10 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all text-center space-y-4">
                                <div className={`w-16 h-16 rounded-2xl ${value.bg} flex items-center justify-center mx-auto mb-6 text-2xl`}>
                                    {value.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800">{value.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold text-indigo-600 mb-1">10k+</p>
                            <p className="text-slate-500 text-sm">Active Students</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-purple-600 mb-1">500+</p>
                            <p className="text-slate-500 text-sm">Partner Schools</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-emerald-600 mb-1">99.9%</p>
                            <p className="text-slate-500 text-sm">System Uptime</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-pink-600 mb-1">24/7</p>
                            <p className="text-slate-500 text-sm">Expert Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white text-slate-400 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <Logo className="w-8 h-8 mb-4 md:mb-0" />
                    <p className="text-sm">© 2026 EduDesk. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
