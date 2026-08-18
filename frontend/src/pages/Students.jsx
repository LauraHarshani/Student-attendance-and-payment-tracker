import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Edit, Trash2, User, X } from 'lucide-react';

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('studentList');
    if (savedStudents) {
      return JSON.parse(savedStudents);
    }
    return [
      { id: '1111', name: 'Nimal', email: 'nimal@gmail.com', phone: '0751234567', payment: 'Paid' },
      { id: '1112', name: 'kamal', email: 'kamal@gmail.com', phone: '0711234567', payment: 'Paid' },
      { id: '1123', name: 'Sadun', email: 'sadun@gmail.com', phone: '0761234567', payment: 'Paid' },
      { id: '1114', name: 'Kasun', email: 'kasun@gmail.com', phone: '0771234567', payment: 'Paid' },
      { id: '1125', name: 'Kaushi', email: 'kaushi@gmail.com', phone: '0781234567', payment: 'Paid' },
      { id: '1129', name: 'Sithumini', email: 'sithu@gmail.com', phone: '0761243434', payment: 'Paid' },
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleDelete = (idToRemove) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const updatedStudents = students.filter(student => student.id !== idToRemove);
      setStudents(updatedStudents);
      localStorage.setItem('studentList', JSON.stringify(updatedStudents));
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student); 
    setIsEditModalOpen(true); 
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedStudents = students.map((s) =>
      s.id === editingStudent.id ? editingStudent : s
    );
    setStudents(updatedStudents); 
    localStorage.setItem('studentList', JSON.stringify(updatedStudents));
    setIsEditModalOpen(false); 
  };

  const filteredStudents = students.filter((student) => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl p-6 shadow-sm relative">
      
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-extrabold text-black mb-1">Students</h2>
          <p className="text-gray-600 text-sm">Manage and view all student information.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Search name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10 pr-4 py-2.5 border border-gray-400 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128] w-64 text-black" 
            />
          </div>
          
          <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-400 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors">
            <Filter size={18} /> Filter
          </button>
          
          {/* Add Student Button */}
          <button 
            onClick={() => navigate('/students/add')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2532A8] hover:bg-[#1B2580] text-white rounded-lg text-sm font-semibold transition-colors shadow-md cursor-pointer"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* Table Container - flex-1 , flex flex-col ,Pagination down */}
      <div className="bg-[#F8F9FA] rounded-xl p-6 flex-1 flex flex-col justify-between border border-gray-200 overflow-hidden">
         
         {/* Table Content Area */}
         <div className="overflow-y-auto flex-1 pr-1">
           <div className="grid grid-cols-[0.5fr_1.2fr_1.5fr_1.2fr_0.8fr_0.8fr] px-5 py-4 bg-[#E2E8F0] rounded-lg text-sm font-bold text-gray-800 mb-4">
              <div>ID</div>
              <div>Name</div>
              <div>Email</div>
              <div>Phone Number</div>
              <div className="text-center">Payment</div>
              <div className="text-right pr-2">Actions</div>
           </div>

           {filteredStudents.length === 0 ? (
             <div className="text-center py-10 text-gray-500 font-medium">
               No students found matching your search.
             </div>
           ) : (
             <div className="space-y-3">
               {filteredStudents.map((student) => (
                 <div 
                    key={student.id} 
                    className="grid grid-cols-[0.5fr_1.2fr_1.5fr_1.2fr_0.8fr_0.8fr] items-center px-5 py-3.5 bg-white border border-gray-400 rounded-lg text-sm text-black font-medium hover:shadow-md transition-shadow"
                 >
                   <div>{student.id}</div>
                   <div>{student.name}</div>
                   <div>{student.email}</div>
                   <div>{student.phone}</div>
                   <div className="text-center">
                     <span className={`px-4 py-1.5 text-white font-bold text-xs rounded-full tracking-wide shadow-sm ${student.payment === 'Paid' ? 'bg-[#4CAF50]' : 'bg-red-500'}`}>
                       {student.payment}
                     </span>
                   </div>
                   
                   {/* Action Buttons */}
                   <div className="flex justify-end gap-4 text-gray-600">
                     <button 
                       onClick={() => handleEditClick(student)} 
                       className="hover:text-blue-600 transition-colors"
                       title="Edit"
                     >
                       <Edit size={18} />
                     </button>
                     
                     <button 
                       onClick={() => handleDelete(student.id)}
                       className="hover:text-red-600 transition-colors"
                       title="Delete"
                     >
                       <Trash2 size={18} />
                     </button>
                     
                     <button 
                       onClick={() => navigate(`/students/profile/${student.id}`)}
                       className="hover:text-gray-900 transition-colors cursor-pointer" 
                       title="View Profile"
                     >
                       <User size={18} />
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>

         {/* Pagination Section - */}
         <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-2 flex-shrink-0">
            <button className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-100 transition-colors">&lt;</button>
            <button className="px-3.5 py-1.5 rounded bg-[#4F46E5] text-white font-bold shadow-sm">1</button>
            <button className="px-3.5 py-1.5 border border-gray-300 rounded bg-white text-gray-600 hover:bg-gray-100 transition-colors font-medium">2</button>
            <span className="px-2 text-gray-400 font-bold">...</span>
            <button className="px-3.5 py-1.5 border border-gray-300 rounded bg-white text-gray-600 hover:bg-gray-100 transition-colors font-medium">24</button>
            <button className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-100 transition-colors">&gt;</button>
         </div>

      </div>

      {/* --- Edit Student Modal --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsEditModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Student</h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={editingStudent.phone}
                  onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Status</label>
                <select 
                  value={editingStudent.payment}
                  onChange={(e) => setEditingStudent({...editingStudent, payment: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}