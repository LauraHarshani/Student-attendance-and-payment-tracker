import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Users,
  Check,
  X,
  Download
} from 'lucide-react';

const ATTENDANCE_KEY = 'attendanceHistory';

export default function AttendanceHistory() {

    const navigate = useNavigate();

    // Get saved attendance records
    const [attendanceRecords] = useState(() => {
        const saved = localStorage.getItem(ATTENDANCE_KEY);

        if (saved) {
        return JSON.parse(saved);
        }

        return [];
    });

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 5;

    const students = JSON.parse(
    localStorage.getItem('studentList') || '[]'
    );

    // Find student name
    const getStudentName = (studentId) => {
        const student = students.find(
        (student) => student.id === studentId
        );

        return student ? student.name : 'Unknown Student';
    };

    // Filter records
    const filteredRecords = useMemo(() => {
        return attendanceRecords.filter((record) => {
        // Date filter
        const recordDate = record.date;

        const matchesFromDate =
            !fromDate || recordDate >= fromDate;

        const matchesToDate =
            !toDate || recordDate <= toDate;

        // Student search
        const studentName = getStudentName(record.studentId);

        const matchesSearch =
            `${studentName} ${record.studentId}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return (
            matchesFromDate &&
            matchesToDate &&
            matchesSearch
        );
        });
    }, [attendanceRecords, fromDate, toDate, searchTerm]);

    // Summary
    const totalRecords = filteredRecords.length;

    const presentRecords = filteredRecords.filter(
        (record) => record.status === 'Present'
    ).length;

    const absentRecords = filteredRecords.filter(
        (record) => record.status === 'Absent'
    ).length;

    const attendancePercentage =
    totalRecords > 0
      ? Math.round((presentRecords / totalRecords) * 100)
      : 0;

    const absencePercentage =
    totalRecords > 0
      ? Math.round((absentRecords / totalRecords) * 100)
      : 0;

    //pagination
    const totalPages = Math.ceil(
        filteredRecords.length / recordsPerPage
    );

    const indexOfLastRecord = currentPage * recordsPerPage;

    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = filteredRecords.slice(
        indexOfFirstRecord,
        indexOfLastRecord
    );

    // Search button
    const handleSearch = () => {
        setCurrentPage(1);
    };

    // Student search
    const handleStudentSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    // Format date for table
    const formatDate = (date) => {
        if (!date) return '';

        return new Date(`${date}T00:00:00`).toLocaleDateString(
        'en-GB',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }
        );
    };
    const handleReport = () => {
        if (filteredRecords.length === 0) {
            alert('No attendance records available for the report.');
            return;
        }

        // Report title
        const title = ['ATTENDANCE REPORT'];


        // Date range
        let dateRange = '';

        if (!fromDate && !toDate) {
            dateRange = 'All Dates';
        } 
        else if (fromDate && toDate) {
            dateRange = `From ${formatDate(fromDate)} To ${formatDate(toDate)}`;
        } 
        else if (fromDate) {
            dateRange = `From ${formatDate(fromDate)} To All`;
        } 
        else if (toDate) {
            dateRange = `All Dates To ${formatDate(toDate)}`;
        }

        // Summary
        const summary = [
            ['Date Range', dateRange],
            ['Total Data', totalRecords],
            ['Attendance Percentage', `${attendancePercentage}%`],
            ['Absence Percentage', `${absencePercentage}%`],
        ];

        // Table headers
        const headers = [
            "Student's Name",
            "Student's ID",
            "Date",
            "Status"
        ];

        // Table data
        const rows = filteredRecords.map((record) => [
            getStudentName(record.studentId),
            record.studentId,

            formatDate(record.date),

            record.status
        ]);

        // Create CSV
        const csvRows = [
            title,
            [],
            ...summary,
            [],
            headers,
            ...rows
        ];

        const csvContent = csvRows
            .map((row) =>
            row
                .map((value) =>
                `"${String(value ?? '').replace(/"/g, '""')}"`
                )
                .join(',')
            )
            .join('\n');

        // Create file
        const blob = new Blob(
            ['\uFEFF' + csvContent],
            {
            type: 'text/csv;charset=utf-8;'
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;
        link.download = 'attendance-report.csv';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        };

    return (
        <div className='space-y-8'>
            {/*Header*/}
            <div>
                <button
                onClick={() => navigate('/attendance')}
                className="mb-4 text-gray-900 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft size={28} />
                </button>

                <h1 className="text-3xl font-bold text-black">
                    Attendance History
                </h1>
            </div>

            {/*Date filters*/}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className='flex items-center gap-2'>
                    <label className="font-medium text-gray-800">
                        From
                    </label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="h-10 w-48 rounded-lg border border-gray-300 bg-white pl-5 pr-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <span className="text-gray-700 font-medium">
                    to
                </span>

                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                    setToDate(e.target.value);
                    setCurrentPage(1);
                    }}
                    className="h-10 w-48 rounded-lg border border-gray-300 bg-white pl-5 pr-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            
                <button
                    // onClick={handleSearch}
                    className="h-10 rounded-lg bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                    Search
                </button>
            </div>

            {/* Summary Cards */}
            <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>

                {/* Total Records */}
                <div className='rounded-2xl bg-blue-100 p-5'>
                    <div className="flex items-center gap-3">
                        <Users
                            size={22}
                            className="text-blue-950"
                        />
                        <span className='text-sm font-semibold text-blue-950'>Total Data</span>
                    </div>
                    <p className="mt-5 text-2xl font-bold text-blue-950">
                        {totalRecords}
                    </p>
                    <p className="mt-2 text-xs text-blue-950">
                        Total records
                    </p>
                </div>

                {/*Attendance percentage*/}
                <div className='rounded-2xl bg-green-100 p-5'>
                    <div className='flex items-center gap-3'>
                        <Check
                            size={22}
                            className='text-green-900'
                        />
                        <span className='text-sm font-semibold text-green-900'>Attendance</span>
                    </div>
                    <p className="mt-5 text-2xl font-bold text-green-900">
                        {attendancePercentage}%
                    </p>
                    <p className="mt-2 text-xs text-green-900">
                        Average attendance
                    </p>
                </div>

                {/*Absent percentage*/}
                <div className='rounded-2xl bg-red-100 p-5'>
                    <div className='flex items-center gap-3'>
                        <X
                            size={22}
                            className='text-red-900'
                        />
                        <span className='text-sm font-semibold text-red-900'>Absent</span>
                    </div>

                    <p className="mt-5 text-2xl font-bold text-red-900">
                        {absencePercentage}%
                    </p>

                    <p className="mt-2 text-xs text-red-900">
                        Average absence
                    </p>
                </div>
            </div>
            
            {/*Search*/}
            <div className='relative w-full max-w-sm'>
                <Search
                    size={18}
                    className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
                />

                <input
                    type="text"
                    placeholder="Search students"
                    value={searchTerm}
                    onChange={handleStudentSearch}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/*Table*/}
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse text-sm'>
                    <thead>
                        <tr className='border-y border-gray-300 bg-gray-50 text-left'>
                            <th className='px-5 py-3 font-semibold text-gray-800'>
                                Student Name
                            </th>
                            <th className='px-5 py-3 font-semibold text-gray-800'>
                                Student ID
                            </th>
                            <th className='px-5 py-3 font-semibold text-gray-800'>
                                Date
                            </th>
                            <th className='px-5 py-3 font-semibold text-gray-800'>
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {currentRecords.length > 0 ?(
                            currentRecords.map((record, index) => (

                                <tr
                                key={`${record.studentId}-${record.date}-${index}`}
                                className="border-b border-gray-200"
                                >

                                <td className="px-5 py-3.5 text-gray-800">
                                    {getStudentName(record.studentId)}
                                </td>

                                <td className="px-5 py-3.5 text-gray-700">
                                    {record.studentId}
                                </td>

                                <td className="px-5 py-3.5 text-gray-700">
                                    {formatDate(record.date)}
                                </td>

                                <td className="px-5 py-3.5">

                                    <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                        record.status === 'Present'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                    >
                                    {record.status}
                                    </span>

                                </td>

                                </tr>

                            ))

                            ) : (

                            <tr>
                                <td
                                colSpan="4"
                                className="py-10 text-center text-sm text-gray-500"
                                >
                                No attendance records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-5">

                {/* Report */}
                <button
                    onClick={handleReport}
                    className="flex w-fit items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                    <Download size={18} />
                    Report
                </button>

                {/* Pagination */}
                {totalPages > 0 && (
                <div className="flex items-center gap-2">

                    {/* Previous */}
                    <button
                        onClick={() =>
                        setCurrentPage((page) =>
                        Math.max(page - 1, 1)
                        )
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-500 hover:bg-gray-100"
                    >
                    ‹
                    </button>

                    {/* Page numbers */}
                    {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                    ).map((page) => (

                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-3.5 py-1.5 text-sm ${
                        currentPage === page
                            ? 'bg-[#4F46E5] text-white font-bold'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>

                    ))}

                    {/* Next */}
                    <button
                        onClick={() =>
                            setCurrentPage((page) =>
                            Math.min(page + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-500 hover:bg-gray-100"
                    >
                        ›
                    </button>

                </div>
                )}

            </div>
        </div>
    )
}