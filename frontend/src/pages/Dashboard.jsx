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
        fetchStats();
    }, [user]);

    const stats = [
        { name: 'Total Students', value: statsData?.totalStudents || 0, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
        { name: 'Total Teachers', value: statsData?.totalTeachers || 0, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
        { name: 'Active Courses', value: statsData?.totalCourses || 0, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    ];

    if (loading) {
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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="h-24 w-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <span className="text-4xl">👋</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {user?.name || 'Student'}!
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Your dashboard is ready. Access your profile, enrolled courses, and other resources from the sidebar.
                    </p>
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
