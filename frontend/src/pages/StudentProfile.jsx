import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { User } from 'lucide-react';

export default function StudentProfile() {
  const { id } = useParams(); 

  const allStudents = (() => {
    const saved = localStorage.getItem('studentList');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: '1111', name: 'Nimal', email: 'nimal@gmail.com', phone: '0751234567', address: 'Colombo', dob: '15/05/2002', joinedDate: '10/01/2026', payment: 'Paid' },
      { id: '1112', name: 'kamal', email: 'kamal@gmail.com', phone: '0711234567', address: 'Gampaha', dob: '20/08/2003', joinedDate: '12/01/2026', payment: 'Paid' },
      { id: '1123', name: 'Sadun', email: 'sadun@gmail.com', phone: '0761234567', address: 'Kandy', dob: '05/12/2001', joinedDate: '15/01/2026', payment: 'Paid' },
      { id: '1114', name: 'Kasun', email: 'kasun@gmail.com', phone: '0771234567', address: 'Galle', dob: '22/03/2002', joinedDate: '18/01/2026', payment: 'Paid' },
      { id: '1125', name: 'Kaushi', email: 'kaushi@gmail.com', phone: '0781234567', address: 'Matara', dob: '11/11/2003', joinedDate: '20/01/2026', payment: 'Paid' },
      { id: '1129', name: 'Sithumini', email: 'sithu@gmail.com', phone: '0761243434', address: 'Kurunegala', dob: '30/06/2002', joinedDate: '25/01/2026', payment: 'Paid' },
    ];
  })();

  const foundStudent = allStudents.find((s) => s.id === id);

  const student = {
    id: foundStudent ? foundStudent.id : id,
    name: foundStudent ? (foundStudent.name || foundStudent.fullName) : 'Unknown Student',
    email: foundStudent ? foundStudent.email : 'N/A',
    phone: foundStudent ? foundStudent.phone : 'N/A',
    address: foundStudent ? foundStudent.address : 'N/A',     
    dob: foundStudent ? foundStudent.dob : 'N/A',             
    joinedDate: foundStudent ? foundStudent.joinedDate : 'N/A', 
    attendanceRate: '94%',
    month: 'July 2026',
    presentDays: 19,
    totalDays: 20,
    absences: 1,
    paymentStatus: foundStudent ? foundStudent.payment : 'PAID',
    paidDate: '05-08-2026',
    amount: 'LKR 15,000'
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-sm overflow-y-auto">
      
      {/* Top Header & Breadcrumb */}
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-3xl font-extrabold text-black mb-1">Profile</h2>
        <p className="text-gray-500 text-sm">
          <Link to="/students" className="text-gray-700 font-semibold hover:underline">Students</Link> 
          <span className="mx-2 text-gray-400">&gt;</span> 
          <span className="text-blue-600 font-semibold">Profile</span>
        </p>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-6">
        
        {/* Left Side: Student Info Card */}
        <div className="lg:col-span-6 bg-[#F8F9FA] rounded-2xl p-6 border border-gray-200 flex flex-col items-center">
          
          {/* Profile Avatar Icon */}
          <div className="w-24 h-24 rounded-full border-2 border-gray-400 flex items-center justify-center bg-gray-100 text-gray-500 mb-5 shadow-inner">
            <User size={52} strokeWidth={1.5} />
          </div>

          {/* Info Fields */}
          <div className="w-full space-y-3">
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              ID : {student.id}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Name : {student.name}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Email : {student.email}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Phone : {student.phone}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Address : {student.address}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Date of Birth : {student.dob}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Joined Date : {student.joinedDate}
            </div>
          </div>
        </div>

        {/* Right Side: Attendance & Payment Summaries */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          
          {/* Attendance Summary Card */}
          <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Attendance Summary</h3>
            
            <div className="bg-white rounded-xl p-5 border border-gray-200 mb-4 flex items-center justify-between shadow-sm">
              <span className="text-4xl font-extrabold text-black">{student.attendanceRate}</span>
              <span className="text-sm font-semibold text-gray-600">Month : {student.month}</span>
            </div>

            <div className="grid grid-cols-3 text-center pt-2 border-t border-gray-300">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Present Days</p>
                <p className="text-lg font-bold text-black">{student.presentDays}</p>
              </div>
              <div className="border-x border-gray-300">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Days</p>
                <p className="text-lg font-bold text-black">{student.totalDays}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Absences</p>
                <p className="text-lg font-bold text-black">{student.absences}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-200 flex flex-col justify-between">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Summary</h3>
            
            <div className="py-2 mb-4">
              <div className={`w-full py-4 text-white font-extrabold text-xl rounded-xl text-center shadow-md tracking-wider transition-colors ${student.paymentStatus.toLowerCase() === 'paid' ? 'bg-[#10B981]' : 'bg-red-500'}`}>
                {student.paymentStatus}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-300 text-sm font-semibold text-gray-700">
              <span>Paid Date : {student.paidDate}</span>
              <span>Amount : {student.amount}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}