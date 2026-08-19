import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Users,
  Check,
  X,
  CalendarDays,
  Download,
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
                        // value={fromDate}
                        // onChange={(e) => {
                        //     setFromDate(e.target.value);
                        //     setCurrentPage(1);
                        // }}
                        className="h-10 w-48 rounded-lg border border-gray-300 bg-white pl-5 pr-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <span className="text-gray-700 font-medium">
                    to
                </span>

                <input
                    type="date"
                    // value={toDate}
                    // onChange={(e) => {
                    // setToDate(e.target.value);
                    // setCurrentPage(1);
                    // }}
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
                        {/* {totalRecords} */}
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
                        {/* {attendancePercentage}% */}
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
                        {/* {absencePercentage}% */}
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
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>

            
        </div>
    )
}