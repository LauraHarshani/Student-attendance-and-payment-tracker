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
        </div>
    )
}