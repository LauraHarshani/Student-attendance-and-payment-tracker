import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Edit, Trash2, User, X } from 'lucide-react';

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Fetch Students
      const studentRes = await fetch('http://localhost:5000/api/students', { headers });
      let studentsData = [];
      if (studentRes.ok) {
        studentsData = await studentRes.json();
      }

      // 2. Fetch Payments to check monthly records
      const paymentRes = await fetch('http://localhost:5000/api/payments', { headers });
      let paymentsData = [];
      if (paymentRes.ok) {
        const payJson = await paymentRes.json();
        paymentsData = Array.isArray(payJson) ? payJson : (payJson.payments || payJson.data || []);
      }

      // Get current system year and month for dynamic checking
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonthNum = now.getMonth();

      // 3. Combine Data: Automatically set "Paid" if a payment exists for the CURRENT month, otherwise "Pending"
      const updatedStudents = studentsData.map(student => {
        const studentPayments = paymentsData.filter(pay => 
          String(pay.idNumber) === String(student.idNumber) || 
          String(pay.studentId) === String(student.idNumber) ||
          String(pay.student) === String(student._id)
        );

        // Check if any payment falls in the current year and month
        const paidThisMonth = studentPayments.some(pay => {
          const pDate = new Date(pay.paymentDate || pay.createdAt);
          return pDate.getFullYear() === currentYear && pDate.getMonth() === currentMonthNum;
        });

        return {
          ...student,
          displayPayment: paidThisMonth ? 'Paid' : 'Pending'
        };
      });

      setStudents(updatedStudents);

    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleDelete = async (idToRemove) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/students/${idToRemove}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setStudents(students.filter(student => student._id !== idToRemove));
        }
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student); 
    setIsEditModalOpen(true); 
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/students/${editingStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingStudent)
      });

      if (response.ok) {
        // Refresh the whole list to keep sync accurate
        fetchStudents();
        setIsEditModalOpen(false); 
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.idNumber?.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesFilter = filterStatus === 'All' || (student.displayPayment || 'Pending') === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl p-6 shadow-sm relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-extrabold text-black mb-1">Students</h2>
          <p className="text-gray-600 text-sm">Manage and view all student information.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
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
          
          <div className="relative flex items-center">
            <span className="absolute left-3 pointer-events-none text-gray-600">
              <Filter size={18} />
            </span>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-400 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors focus:outline-none cursor-pointer text-gray-700 appearance-none"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          
          <button 
            onClick={() => navigate('/students/add')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2532A8] hover:bg-[#1B2580] text-white rounded-lg text-sm font-semibold transition-colors shadow-md cursor-pointer"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      <div className="bg-[#F8F9FA] rounded-xl p-6 flex-1 flex flex-col justify-between border border-gray-200 overflow-hidden">
         <div className="overflow-y-auto flex-1 pr-1">
           <div className="grid grid-cols-[0.5fr_1.2fr_1.5fr_1.2fr_0.8fr_0.8fr] px-5 py-4 bg-[#E2E8F0] rounded-lg text-sm font-bold text-gray-800 mb-4">
              <div>ID</div>
              <div>Name</div>
              <div>Email</div>
              <div>Phone Number</div>
              <div className="text-center">Payment</div>
              <div className="text-right pr-2">Actions</div>
           </div>

           {currentStudents.length === 0 ? (
             <div className="text-center py-10 text-gray-500 font-medium">
               No students found.
             </div>
           ) : (
             <div className="space-y-3">
               {currentStudents.map((student) => (
                 <div 
                    key={student._id} 
                    className="grid grid-cols-[0.5fr_1.2fr_1.5fr_1.2fr_0.8fr_0.8fr] items-center px-5 py-3.5 bg-white border border-gray-400 rounded-lg text-sm text-black font-medium hover:shadow-md transition-shadow"
                 >
                   <div>{student.idNumber}</div>
                   <div>{student.name}</div>
                   <div>{student.email}</div>
                   <div>{student.phone}</div>
                   <div className="text-center">
                     <span className={`px-4 py-1.5 text-white font-bold text-xs rounded-full tracking-wide shadow-sm ${(student.displayPayment || 'Pending') === 'Paid' ? 'bg-[#4CAF50]' : 'bg-red-500'}`}>
                       {student.displayPayment || 'Pending'}
                     </span>
                   </div>
                   
                   <div className="flex justify-end gap-4 text-gray-600">
                     <button 
                       onClick={() => handleEditClick(student)} 
                       className="hover:text-blue-600 transition-colors"
                       title="Edit"
                     >
                       <Edit size={18} />
                     </button>
                     
                     <button 
                       onClick={() => handleDelete(student._id)}
                       className="hover:text-red-600 transition-colors"
                       title="Delete"
                     >
                       <Trash2 size={18} />
                     </button>
                     
                     <button 
                       onClick={() => navigate(`/students/profile/${student._id}`)}
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

         <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200 gap-2 flex-shrink-0">
            <button 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border border-gray-300 rounded transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
            >
              &lt;
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3.5 py-1.5 rounded font-bold shadow-sm ${currentPage === index + 1 ? 'bg-[#4F46E5] text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1.5 border border-gray-300 rounded transition-colors ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
            >
              &gt;
            </button>
         </div>
      </div>

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
                  type="text" required value={editingStudent.name}
                  onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" required value={editingStudent.email}
                  onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" required value={editingStudent.phone}
                  onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Status</label>
                <select 
                  value={editingStudent.payment || 'Pending'}
                  onChange={(e) => setEditingStudent({...editingStudent, payment: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" onClick={() => setIsEditModalOpen(false)}
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