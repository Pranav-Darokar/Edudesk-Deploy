import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Modal from '../components/Modal';
import api from '../services/api';
import { toast } from 'react-toastify';
import { CalendarIcon, CheckCircleIcon, XCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

const AdminAttendance = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const fetchData = async () => {
        try {
            const [attRes, studentRes] = await Promise.all([
                api.get(`/attendance/daily?date=${date}`),
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
            await api.post('/attendance/mark', {
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
                    actions={true}
                    renderActions={(student) => (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {
                                    setEditingStudent(student);
                                    setIsModalOpen(true);
                                }}
                                className="p-1 rounded hover:bg-indigo-50 text-indigo-600"
                                title="Edit"
                            >
                                <PencilIcon className="h-6 w-6" />
                            </button>
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingStudent(null);
                }}
                title="Edit Attendance"
            >
                {editingStudent && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Student</p>
                            <p className="text-lg font-semibold">{editingStudent.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                className="mt-1 block w-full border rounded-md p-2"
                                value={editingStudent.present === true ? 'Present' : editingStudent.present === false ? 'Absent' : ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setEditingStudent({
                                        ...editingStudent,
                                        present: val === 'Present' ? true : val === 'Absent' ? false : null
                                    });
                                }}
                            >
                                <option value="">Select Status</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Remarks</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={editingStudent.remarks || ''}
                                onChange={(e) => setEditingStudent({ ...editingStudent, remarks: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingStudent(null);
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (editingStudent.present === null) return;
                                    try {
                                        await api.post('/attendance/mark', {
                                            studentId: editingStudent.id,
                                            date,
                                            present: editingStudent.present,
                                            remarks: editingStudent.remarks
                                        });
                                        toast.success('Attendance updated');
                                        setIsModalOpen(false);
                                        setEditingStudent(null);
                                        fetchData();
                                    } catch (error) {
                                        toast.error('Failed to update attendance');
                                    }
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default AdminAttendance;
