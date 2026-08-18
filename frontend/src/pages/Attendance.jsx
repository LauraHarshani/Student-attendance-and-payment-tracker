import React, { useEffect, useState } from 'react';
import {
  History,
  Users,
  Check,
  X
} from "lucide-react"

const Students = [
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
    studentId: 'COM08',
    status: 'Absent',
  },
  {
    id: 8,
    name: 'Harshani Fernando',
    studentId: 'COM08',
    status: 'Absent',
  },
];

export default function Attendance() {

  const [students, setStudents] = useState(Students);
  const [CurrentDate, setCurrentDate] = useState(new Date());

  //live date

  const FormatDate = CurrentDate.toLocaleDateString('us-en', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

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
            {/* {totalStudents} */}
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
            {/* {presentStudents} */}
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
            {/* {absentStudents} */}
          </p>

          <p className="mt-1 text-xs text-red-900">
            Absent today
          </p>
        </div>

      </div>

    </div>
  )
}