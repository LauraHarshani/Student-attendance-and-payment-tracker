import React, {useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Users,
  Check,
  X,
  Search,
} from "lucide-react"

const API_URL = 'http://localhost:5000/api';

export default function Attendance() {

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 8;

  // Format date to store

  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  //live date display

  const FormatDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Load students from students.jsx
  
  const loadStudentsForDate = async (date) => {

    //get students from backend
    const studentsResponse = await fetch(`${API_URL}/students`)

    if (!studentsResponse.ok) {
      throw new Error('Failed to fetch students');
    }

    const dateKey = getDateKey(date);

    const savedStudents = await studentsResponse.json();

    // Get attendance records for selected date
    const attendanceResponse = await fetch(`${API_URL}/attendance/date/${dateKey}`);

    if(!attendanceResponse.ok){
      throw new Error('Failed to fetch attendance');
    }

    const attendanceRecords = await attendanceResponse.json();

    // Create a quick lookup
    const attendanceMap = {};

    attendanceRecords.forEach((record) => {
      attendanceMap[record.idNumber] = record.status;
    });

    // Add attendance status to every student
    const studentsWithStatus = savedStudents.map((student) => ({
      ...student,
      status: attendanceMap[student.idNumber] || 'Absent'
    }));

    setStudents(studentsWithStatus);
  };

  // Load students when page opens
  useEffect(()=>{
    loadStudentsForDate(selectedDate);
  },[selectedDate]);


  // Change date
  const handleDateChange = (e) => {

    const [year, month, day] = e.target.value
      .split('-')
      .map(Number);

    const newDate = new Date(year, month - 1, day);

    setSelectedDate(newDate);
    setCurrentPage(1);

    // loadStudentsForDate(newDate);
  };

  // Mark student present
  const toggleAttendance = (idNumber) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.idNumber === idNumber
          ? {
              ...student,
              status: student.status === 'Present' ? 'Absent' : 'Present',
            }
          : student
      )
    );
  };
  //filter search bar
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.idNumber}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  //save attendance
  const saveAttendance = async () => {
    try {
      const dateKey = getDateKey(selectedDate);

      const records = students.map((student) => ({
        idNumber: student.idNumber,
        status: student.status,
      }));

      const response = await fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateKey,
          records,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save attendance');
      }

      alert('Attendance saved successfully!');

    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance.');
    }
  };

  //pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  const currentStudents = filteredStudents.slice(
  indexOfFirstStudent,
  indexOfLastStudent
);

  //Total students count
  const totalStudents = students.length;

  //Present student
  const presentStudents = students.filter((student)=>
    student.status==="Present"
  ).length;

  //Absent students
  const absentStudents = totalStudents - presentStudents;

  return(
    <div className="space-y-6">

      {/*header title*/}
      <div className="flex items-center justify-between">
        <div >
          <h1 className="text-3xl font-bold text-black">Attendance</h1>
          <p className="text-gray-600 text-sm">Manage today's student attendance</p>
        </div>
        <div>
          <button
            type="button"
            className="flex items-center gap-2 border rounded-md border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 cursor-pointer transition hover:bg-blue-50"
            onClick={() => navigate('/attendance/history')}
          >
            <History size={18} />
            History
          </button>
        </div>
      </div>

      {/*Live Date*/}
      <h2 className='text-center text-3xl font-semibold text-gray-900'>{FormatDate}</h2>

       {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Total */}
        <div className="rounded-xl bg-blue-100 p-5">
          <div className="flex items-center gap-3">
            <Users size={22} className="text-blue-950" />

            <span className="text-sm font-semibold text-blue-950">
              Total
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-blue-950">
            {totalStudents}
          </p>

          <p className="mt-1 text-xs text-blue-950">
            Students registered
          </p>
        </div>

        {/* Present */}
        <div className="rounded-xl bg-green-100 p-5">
          <div className="flex items-center gap-3">
            <Check size={22} className="text-green-900" />

            <span className="text-sm font-semibold text-green-900">
              Present
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-green-900">
            {presentStudents}
          </p>

          <p className="mt-1 text-xs text-green-900">
            Present today
          </p>
        </div>

        {/* Absent */}
        <div className="rounded-xl bg-red-100 p-5">
          <div className="flex items-center gap-3">
            <X size={22} className="text-red-900" />

            <span className="text-sm font-semibold text-red-900">
              Absent
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-red-900">
            {absentStudents}
          </p>

          <p className="mt-1 text-xs text-red-900">
            Absent today
          </p>
        </div>

      </div>

      {/*Attendance section */}
      <div className='mt-6'>

        <div>
          <h2 className="text-lg font-semibold mb-5 text-black">Today's Attendance</h2>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/*student Search*/}
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Date selector*/}
          <div className="flex h-10 items-center gap-3 rounded-md border border-gray-300 px-3 text-sm text-gray-700">

            <input
              type="date"
              value={getDateKey(selectedDate)}
              onChange={handleDateChange}
              className="bg-transparent text-sm text-gray-700 outline-none"
            />

          </div>
        </div>

        {/*Table*/}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Student Name
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Student ID
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Mark Attendance
                </th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.map((student) => (

                <tr
                  key={student.idNumber}
                  className="border-b border-gray-100"
                >

                  <td className="px-4 py-3 text-gray-800">
                    {student.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {student.idNumber}
                  </td>

                  <td className="px-4 py-3">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        student.status === 'Present'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {student.status}
                    </span>

                  </td>

                  <td className="px-4 py-3 text-center">

                    <button
                      type="button"
                      onClick={() => toggleAttendance(student.idNumber)}
                      className={`rounded-md px-4 py-1.5 text-xs font-medium text-white transition ${
                        student.status === 'Present'
                          ? 'bg-red-700 hover:bg-red-600'
                          : 'bg-blue-800 hover:bg-blue-700'
                      }`}
                    >
                      {student.status === 'Present' ? 'Mark' : 'Mark'}
                    </button>

                  </td>

                </tr>

              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No students found.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-2">

          {/* Previous */}
          <button
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-100 transition-colors"
          >
            &lt;
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3.5 py-1.5 rounded font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-[#4F46E5] text-white font-bold shadow-sm'
                    : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-100 transition-colors"
          >
            &gt;
          </button>

        </div>

        {/* Save Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={saveAttendance}
            className="rounded-md bg-blue-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Save Attendance
          </button>
        </div>
      </div>

    </div>
  )
}