import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import {
    HomeIcon,
    UserGroupIcon,
    AcademicCapIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    ClipboardDocumentCheckIcon,
    CalendarDaysIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    SunIcon,
    MoonIcon,
    UserCircleIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isDark, setIsDark] = React.useState(() => {
        return localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Profile', href: '/profile', icon: UserCircleIcon },
        { name: 'Students', href: '/students', icon: UserGroupIcon },
        { name: 'Teachers', href: '/teachers', icon: AcademicCapIcon },
        { name: 'Courses', href: '/courses', icon: UserIcon },
    ];

    if (user?.role === 'ADMIN') {
        navigation.push({ name: 'Manage Users', href: '/admin/users', icon: ShieldCheckIcon });
        navigation.push({ name: 'Manage Courses', href: '/admin/courses', icon: BookOpenIcon });
        navigation.push({ name: 'Manage Fees', href: '/admin/fees', icon: CurrencyDollarIcon });
        navigation.push({ name: 'Manage Exams', href: '/admin/exams', icon: ClipboardDocumentCheckIcon });
        navigation.push({ name: 'Attendance', href: '/admin/attendance', icon: CalendarDaysIcon });
        navigation.push({ name: 'Reports', href: '/admin/reports', icon: ChartPieIcon });
        navigation.push({ name: 'System Settings', href: '/admin/system', icon: Cog6ToothIcon });
    } else if (user?.role === 'STUDENT') {
        navigation.push({ name: 'My Exams', href: '/my-exams', icon: ClipboardDocumentCheckIcon });
        navigation.push({ name: 'Attendance', href: '/my-attendance', icon: CalendarDaysIcon });
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 bg-white dark:bg-gray-800 w-64 shadow-lg z-10 flex flex-col transition-colors duration-200">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
                    <Logo className="w-8 h-8" />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-primary dark:text-indigo-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150"
                    >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-8 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center space-x-6">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                        </button>

                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-end mr-1">
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name || 'User'}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{user?.role || 'Role'}</span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold uppercase shadow-sm">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
