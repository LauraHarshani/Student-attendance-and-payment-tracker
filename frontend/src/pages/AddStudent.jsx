import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function AddStudent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    joinedDate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  
    const newStudent = {
      id: formData.idNumber,
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,       
      dob: formData.dob,               
      joinedDate: formData.joinedDate, 
      payment: 'Paid' 
    };

    const existingStudents = JSON.parse(localStorage.getItem('studentList')) || [
      { id: '1111', name: 'Nimal', email: 'nimal@gmail.com', phone: '0751234567', address: 'Colombo', dob: '15/05/2002', joinedDate: '10/01/2026', payment: 'Paid' },
      { id: '1112', name: 'kamal', email: 'kamal@gmail.com', phone: '0711234567', address: 'Gampaha', dob: '20/08/2003', joinedDate: '12/01/2026', payment: 'Paid' },
      { id: '1123', name: 'Sadun', email: 'sadun@gmail.com', phone: '0761234567', address: 'Kandy', dob: '05/12/2001', joinedDate: '15/01/2026', payment: 'Paid' },
      { id: '1114', name: 'Kasun', email: 'kasun@gmail.com', phone: '0771234567', address: 'Galle', dob: '22/03/2002', joinedDate: '18/01/2026', payment: 'Paid' },
      { id: '1125', name: 'Kaushi', email: 'kaushi@gmail.com', phone: '0781234567', address: 'Matara', dob: '11/11/2003', joinedDate: '20/01/2026', payment: 'Paid' },
      { id: '1129', name: 'Sithumini', email: 'sithu@gmail.com', phone: '0761243434', address: 'Kurunegala', dob: '30/06/2002', joinedDate: '25/01/2026', payment: 'Paid' },
    ];

    const updatedList = [...existingStudents, newStudent];
    localStorage.setItem('studentList', JSON.stringify(updatedList));

    alert("Student added successfully!");
    navigate('/students'); 
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-sm">
      
      {/* Top Header & Breadcrumb */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-black mb-1">Add New Student</h2>
        <p className="text-gray-500 text-sm">
          <Link to="/students" className="text-gray-700 font-semibold hover:underline">Students</Link> 
          <span className="mx-2 text-gray-400">&gt;</span> 
          <span className="text-blue-600 font-semibold">Add New student</span>
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-[#F8F9FA] rounded-2xl p-8 border border-gray-200 shadow-inner flex-1 flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter Full Name" 
                  className="w-full px-4 py-3.5 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">ID Number</label>
                <input 
                  type="text" 
                  name="idNumber"
                  required
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="Enter Student ID" 
                  className="w-full px-4 py-3.5 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email Address" 
                  className="w-full px-4 py-3.5 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Phone</label>
                <input 
                  type="text" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter Phone Number" 
                  className="w-full px-4 py-3.5 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Address</label>
                <input 
                  type="text" 
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter Address" 
                  className="w-full px-4 py-3.5 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128]"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Gender</label>
                <div className="relative">
                  <select 
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128] appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                    <ChevronDown size={18} />
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Joined Date</label>
                <input 
                  type="date" 
                  name="joinedDate"
                  required
                  value={formData.joinedDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128]"
                />
              </div>
            </div>

          </div>

          {/* Bottom Action Buttons */}
          <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-300 mt-10">
            <button 
              type="button"
              onClick={() => navigate('/students')}
              className="px-8 py-3.5 bg-[#E5E7EB] hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3.5 bg-[#2532A8] hover:bg-[#1B2580] text-white font-bold rounded-xl text-sm transition-colors shadow-lg"
            >
              Save Student
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}