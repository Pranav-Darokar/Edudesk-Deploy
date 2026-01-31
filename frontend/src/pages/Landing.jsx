import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
    UserGroupIcon,
    AcademicCapIcon,
    CurrencyDollarIcon,
    ClipboardDocumentCheckIcon,
    ArrowRightIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline';
import Logo from '../components/Logo';

const Landing = () => {
    const { user } = useAuth();
    const [theme, setTheme] = useState('light');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const handleContactSubmit = (e) => {
        e.preventDefault();
        toast.success('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
        e.target.reset();
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'features', 'about'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Features', href: '#features' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-indigo-500/20 transition-colors">
            {/* Enhanced Navbar with Glassmorphism */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        {/* Enhanced Logo with Gradient */}
                        <div className="flex items-center space-x-3">
                            <Logo className="w-10 h-10" iconOnly />
                            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                EduDesk
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-10">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.href.substring(1);
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className={`relative text-sm font-semibold transition-all duration-300 group ${isActive
                                            ? 'text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                                            }`}
                                        onClick={() => setActiveSection(link.href.substring(1))}
                                    >
                                        {link.name}
                                        <span
                                            className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                                }`}
                                        />
                                    </a>
                                );
                            })}

                            {/* Theme Toggle with Animation */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-110 hover:rotate-12 group"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? (
                                    <MoonIcon className="h-5 w-5 text-slate-700 dark:text-slate-300 transition-transform group-hover:rotate-12" />
                                ) : (
                                    <SunIcon className="h-5 w-5 text-slate-700 dark:text-slate-300 transition-transform group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                                )}
                            </button>

                            {/* Login & Get Started Buttons */}
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                                    >
                                        <span className="relative z-10">Get Started</span>
                                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Hamburger Menu */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 space-y-3 border-t border-slate-200 dark:border-slate-700 animate-fadeIn">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.href.substring(1);
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        onClick={() => {
                                            setActiveSection(link.href.substring(1));
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                            <div className="flex items-center justify-between px-4 py-2">
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Theme</span>
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    aria-label="Toggle theme"
                                >
                                    {theme === 'light' ? (
                                        <MoonIcon className="h-5 w-5" />
                                    ) : (
                                        <SunIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="block mx-4 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center rounded-xl font-semibold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block mx-4 px-4 py-2 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block mx-4 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center rounded-xl font-semibold"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-800">
                {/* Mesh Gradient / Decorative Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-blue-100/30 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-8 backdrop-blur-sm">
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
                        <span className="text-slate-900 dark:text-slate-100">Redefined.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
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
            <section id="features" className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">Powerful Features</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Everything you need to run your school efficiently, all in one place.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Student Management', desc: 'Track students, profiles, and academic records effortlessly.', icon: UserGroupIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { title: 'Teacher Portals', desc: 'Comprehensive dashboards for faculty to manage courses.', icon: AcademicCapIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { title: 'Fee Tracking', desc: 'Automated billing and payment tracking with reporting.', icon: CurrencyDollarIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { title: 'Exam Control', desc: 'Schedule exams and manage results with ease.', icon: ClipboardDocumentCheckIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
                                <div className={`w-12 h-12 rounded-xl ${feature.bg} dark:bg-opacity-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-24 bg-slate-50 dark:bg-slate-800 border-y border-slate-100 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">About EduDesk</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Empowering institutions with cutting-edge digital tools for a brighter educational future.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
                        <div className="space-y-6">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <span className="text-white font-bold">M</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Our Mission</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                To revolutionize school management by delivering an intuitive, secure, and
                                integrated platform that simplifies administrative complexity and enhances the learning experience.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                                <span className="text-white font-bold">V</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Our Vision</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
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
                            <div key={idx} className="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all text-center space-y-4">
                                <div className={`w-16 h-16 rounded-2xl ${value.bg} dark:bg-opacity-20 flex items-center justify-center mx-auto mb-6 text-2xl`}>
                                    {value.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{value.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold text-indigo-600 mb-1">10k+</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Active Students</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-purple-600 mb-1">500+</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Partner Schools</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-emerald-600 mb-1">99.9%</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">System Uptime</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-pink-600 mb-1">24/7</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Expert Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">Get in Touch</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">Email</p>
                                            <p className="text-slate-600 dark:text-slate-400">contact@edudesk.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">Phone</p>
                                            <p className="text-slate-600 dark:text-slate-400">+1 (555) 123-4567</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">Address</p>
                                            <p className="text-slate-600 dark:text-slate-400">123 Education St, Learning City, ED 12345</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <Logo className="w-8 h-8 mb-4 md:mb-0" />
                    <p className="text-sm">© 2026 EduDesk. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
