import React, { useEffect, useState } from 'react';
import {
  History,
  Users,
  Check,
  X,
  Search,
  CalendarDays
} from "lucide-react"

const AllStudents = [
  {
    id: 1,
    name: 'Minindu Rajapaksha',
    studentId: 'COM01',
    status: 'Absent',
  },
  {
    id: 2,
    name: 'Pasindu Gunasekara',
    studentId: 'COM02',
    status: 'Absent',
  },
  {
    id: 3,
    name: 'Nimal Perera',
    studentId: 'COM05',
    status: 'Absent',
  },
  {
    id: 4,
    name: 'Roshan Fernando',
    studentId: 'COM06',
    status: 'Absent',
  },
  {
    id: 5,
    name: 'Sahan Wijesinghe',
    studentId: 'COM07',
    status: 'Absent',
  },
  {
    id: 6,
    name: 'Sathish Peduru',
    studentId: 'COM08',
    status: 'Absent',
  },
  {
    id: 7,
    name: 'Nirmal Peduru',
    studentId: 'COM09',
    status: 'Absent',
  },
  {
    id: 8,
    name: 'Harshani Fernando',
    studentId: 'COM10',
    status: 'Absent',
  },
];

export default function Attendance() {

  const [students, setStudents] = useState(AllStudents);
  const [CurrentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  //live date

  const FormatDate = CurrentDate.toLocaleDateString('us-en', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Mark student present
  const markAttendance = (studentId) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId
          ? { ...student, status: 'Present' }
          : student
      )
    );
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.studentId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
          <button type="button" className="flex items-center gap-2 border rounded-md border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 cursor-pointer transition hover:bg-blue-50"
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Date */}
          <div className="flex h-10 items-center gap-3 rounded-md border border-gray-300 px-3 text-sm text-gray-700">
            <CalendarDays size={18} className="text-gray-500" />

            <span>
              {CurrentDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>

          </div>
        </div>

        {/*Table*/}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Student's Name
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
              {filteredStudents.map((student) => (

                <tr
                  key={student.id}
                  className="border-b border-gray-100"
                >

                  <td className="px-4 py-3 text-gray-800">
                    {student.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {student.studentId}
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
                      onClick={() => markAttendance(student.id)}
                      disabled={student.status === 'Present'}
                      className={`rounded-md px-4 py-1.5 text-xs font-medium text-white transition ${
                        student.status === 'Present'
                          ? 'cursor-not-allowed bg-gray-300'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {student.status === 'Present' ? 'Marked' : 'Mark'}
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

        {/* Save Button */}
        <div className="mt-5">
          <button
            type="button"
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Save Attendance
          </button>
        </div>
      </div>

    </div>
  )
}