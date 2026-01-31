import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import api from '../services/api';
import { toast } from 'react-toastify';

const StudentExams = () => {
    const [exams, setExams] = useState([]);

    const fetchExams = async () => {
        try {
            const response = await api.get('/exams/my-exams');
            setExams(response.data);
        } catch (error) {
            console.error('Fetch exams error:', error);
            // toast.error('Failed to load exams');
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const columns = [
        { key: 'title', header: 'Exam Title' },
        { key: 'subject', header: 'Subject' },
        { key: 'examDate', header: 'Date', render: (d) => new Date(d).toLocaleString() },
        { key: 'durationMinutes', header: 'Duration (Min)' },
        { key: 'totalMarks', header: 'Total Marks' },
    ];

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">My Exams</h1>
                <p className="mt-2 text-sm text-gray-700">View upcoming and past exams.</p>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <Table
                    columns={columns}
                    data={exams}
                    actions={false}
                />
            </div>
        </Layout>
    );
};

export default StudentExams;
