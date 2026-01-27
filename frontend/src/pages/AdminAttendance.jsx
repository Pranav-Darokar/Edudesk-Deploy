import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import api from '../services/api';
import { toast } from 'react-toastify';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const AdminAttendance = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [students, setStudents] = useState([]);

    const fetchData = async () => {
        try {
            const [attRes, studentRes] = await Promise.all([
                api.get(`/admin/attendance/daily?date=${date}`),
                api.get('/students') // Reuse existing endpoint and filter if needed
            ]);

            // Map students to attendance status
            const studentsList = studentRes.data.content || [];
            const mappedData = studentsList.map(student => {
                const record = (attRes.data || []).find(r => r.student && r.student.id === student.id);
                return {
                    ...student,
                    present: record ? record.present : null,
                    remarks: record ? record.remarks : ''
                };
            });

            setAttendanceData(mappedData);
            setStudents(studentsList);
        } catch (error) {
            toast.error('Failed to load attendance data');
        }
    };

    useEffect(() => {
        fetchData();
    }, [date]);

    const handleMarkAttendance = async (studentId, present) => {
        try {
            await api.post('/admin/attendance/mark', {
                studentId,
                date,
                present,
                remarks: present ? 'Present' : 'Absent'
            });
            toast.success(`Marked as ${present ? 'Present' : 'Absent'}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to mark attendance');
        }
    };

    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Student Name' },
        { key: 'email', header: 'Email' },
        {
            key: 'present',
            header: 'Status',
            render: (present) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${present === true ? 'bg-green-100 text-green-800' :
                    present === false ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {present === true ? 'Present' : present === false ? 'Absent' : 'Not Marked'}
                </span>
            )
        },
    ];

    return (
        <Layout>
            <div className="sm:flex sm:items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Attendance Tracker</h1>
                    <p className="mt-2 text-sm text-gray-700">Monitor and mark daily student attendance.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-600">Select Date:</label>
                    <input
                        type="date"
                        className="border rounded-md p-2 text-sm"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-8">
                <Table
                    columns={columns}
                    data={attendanceData}
                    actions={false}
                    renderActions={(student) => (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleMarkAttendance(student.id, true)}
                                className={`p-1 rounded hover:bg-green-50 ${student.present === true ? 'text-green-600' : 'text-gray-400'}`}
                                title="Mark Present"
                            >
                                <CheckCircleIcon className="h-6 w-6" />
                            </button>
                            <button
                                onClick={() => handleMarkAttendance(student.id, false)}
                                className={`p-1 rounded hover:bg-red-50 ${student.present === false ? 'text-red-600' : 'text-gray-400'}`}
                                title="Mark Absent"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                />
            </div>
        </Layout>
    );
};

export default AdminAttendance;
