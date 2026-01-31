import React from 'react';
import Layout from '../components/Layout';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../services/api';
import Skeleton from '../components/Skeleton';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [statsData, setStatsData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    // Student-specific state
    const [enrolledCourses, setEnrolledCourses] = React.useState([]);
    const [loadingCourses, setLoadingCourses] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            if (user?.role !== 'ADMIN') {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/admin/dashboard/stats');
                setStatsData(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };

        const fetchEnrolled = async () => {
            if (user?.role !== 'STUDENT') {
                setLoadingCourses(false);
                return;
            }

            try {
                const response = await api.get('/enrollments/my-courses');
                setEnrolledCourses(response.data);
            } catch (error) {
                console.error("Failed to fetch enrolled courses", error);
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchStats();
        fetchEnrolled();
    }, [user]);

    const stats = [
        { name: 'Total Students', value: statsData?.totalStudents || 0, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
        { name: 'Total Teachers', value: statsData?.totalTeachers || 0, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
        { name: 'Active Courses', value: statsData?.totalCourses || 0, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    ];

    if (loading || (user?.role === 'STUDENT' && loadingCourses)) {
        return (
            <Layout>
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Skeleton className="h-80 w-full rounded-xl" />
                        <Skeleton className="h-80 w-full rounded-xl" />
                    </div>
                </div>
            </Layout>
        );
    }

    const lineChartData = {
        labels: statsData?.enrollmentTrend?.map(t => t.month) || [],
        datasets: [
            {
                label: 'Enrollment Trend',
                data: statsData?.enrollmentTrend?.map(t => t.count) || [],
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.5)',
                tension: 0.4,
            },
        ],
    };

    const doughnutData = {
        labels: Object.keys(statsData?.roleDistribution || {}),
        datasets: [
            {
                data: Object.values(statsData?.roleDistribution || {}),
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    if (user?.role !== 'ADMIN') {
        return (
            <Layout>
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || 'Student'}! 👋</h2>
                        <p className="text-indigo-100 opacity-90">
                            You are enrolled in <span className="font-bold text-white">{enrolledCourses.length}</span> active courses. Keep up the great work!
                        </p>
                    </div>

                    {/* Quick Stats Row (Optional, can expand later) */}

                    {/* Enrolled Courses Grid */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                                📚
                            </span>
                            Your Enrolled Courses
                        </h3>

                        {enrolledCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enrolledCourses.map((course) => (
                                    <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                                        <div className="h-2 bg-gradient-to-r from-indigo-400 to-cyan-400"></div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1" title={course.title}>
                                                    {course.title}
                                                </h4>
                                                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full shrink-0">
                                                    Active
                                                </span>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 flex-1">
                                                {course.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <div className="text-xs text-gray-400 font-medium flex items-center">
                                                    <span className="mr-1">🕒</span> {course.duration} Weeks
                                                </div>
                                                <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center transition-colors">
                                                    Continue
                                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <div className="text-gray-300 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                                    You haven't enrolled in any courses. Browse our catalog to get started with your learning journey!
                                </p>
                                <a href="/courses" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium">
                                    Browse Courses
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                {/* Icon placeholder */}
                                <div className={`w-8 h-8 ${stat.color}`}></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className="ml-auto">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrollment Growth</h3>
                        <div className="h-64">
                            <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Distribution</h3>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
