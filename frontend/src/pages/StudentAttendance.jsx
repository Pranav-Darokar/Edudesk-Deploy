import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import api from '../services/api';
import { toast } from 'react-toastify';

const StudentAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);

    const fetchAttendance = async () => {
        try {
            const response = await api.get('/attendance/my-attendance');
            setAttendanceData(response.data);
        } catch (error) {
            console.error('Fetch attendance error:', error);
            // toast.error('Failed to load attendance');
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const columns = [
        { key: 'date', header: 'Date', render: (date) => new Date(date).toLocaleDateString() },
        {
            key: 'present',
            header: 'Status',
            render: (present) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {present ? 'Present' : 'Absent'}
                </span>
            )
        },
        { key: 'remarks', header: 'Remarks' },
    ];

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">My Attendance</h1>
                <p className="mt-2 text-sm text-gray-700">View your daily attendance usage.</p>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <Table
                    columns={columns}
                    data={attendanceData}
                    actions={false}
                />
            </div>
        </Layout>
    );
};

export default StudentAttendance;
