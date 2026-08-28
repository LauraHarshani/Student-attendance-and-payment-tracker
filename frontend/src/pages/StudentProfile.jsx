import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { User } from 'lucide-react';

export default function StudentProfile() {
  const { id } = useParams(); 
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch student data from the backend when the page loads
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/students/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setStudent(data);
        } else {
          setError('Student not found or access denied.');
        }
      } catch (err) {
        setError('Server connection failed.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  if (loading) return <div className="flex h-full items-center justify-center text-lg font-bold text-gray-600">Loading Profile...</div>;
  if (error) return <div className="flex h-full items-center justify-center text-lg font-bold text-red-500">{error}</div>;
  if (!student) return <div className="flex h-full items-center justify-center text-lg font-bold text-gray-600">No student data available.</div>;

  // 2. Temporary Attendance Data (To be updated later by Minidu)
  const attendanceHistory = JSON.parse(localStorage.getItem('attendanceHistory')) || [];
  const studentAttendance = attendanceHistory.filter(record => String(record.studentId) === String(id));
  const totalDays = studentAttendance.length;
  const presentDays = studentAttendance.filter(record => record.status === 'Present').length;
  const absences = totalDays - presentDays;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) + '%' : '0%';

  // 3. Temporary Payment Data (To be updated later by Minidu)
  const paymentHistory = JSON.parse(localStorage.getItem('paymentHistory')) || [];
  const studentPayments = paymentHistory.filter(record => String(record.studentId) === String(id));
  studentPayments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
  const latestPayment = studentPayments.length > 0 ? studentPayments[0] : null;
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Helper function to format MongoDB ISO dates (e.g., "2004-01-15T00:00:00.000Z" -> "2004-01-15")
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    return dateString.split('T')[0];
  };

  // 4. Combine API data and UI data
  const displayStudent = {
    id: student.idNumber || student._id,
    name: student.name || 'Unknown Student',
    email: student.email || 'N/A',
    phone: student.phone || 'N/A',
    address: student.address || 'N/A',     
    dob: formatDate(student.dob),             
    joinedDate: formatDate(student.joinedDate), 
    
    attendanceRate: attendanceRate,
    month: currentMonth,
    presentDays: presentDays,
    totalDays: totalDays,
    absences: absences,
    
    paymentStatus: latestPayment ? latestPayment.status : (student.payment || 'Pending'),
    paidDate: latestPayment ? latestPayment.paymentDate : '-',
    amount: latestPayment ? `LKR ${latestPayment.amount.toLocaleString()}` : 'LKR 0'
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-sm overflow-y-auto">
      
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-3xl font-extrabold text-black mb-1">Profile</h2>
        <p className="text-gray-500 text-sm">
          <Link to="/students" className="text-gray-700 font-semibold hover:underline">Students</Link> 
          <span className="mx-2 text-gray-400">&gt;</span> 
          <span className="text-blue-600 font-semibold">Profile</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-6">
        
        <div className="lg:col-span-6 bg-[#F8F9FA] rounded-2xl p-6 border border-gray-200 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-2 border-gray-400 flex items-center justify-center bg-gray-100 text-gray-500 mb-5 shadow-inner">
            <User size={52} strokeWidth={1.5} />
          </div>

          <div className="w-full space-y-3">
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              ID : {displayStudent.id}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Name : {displayStudent.name}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Email : {displayStudent.email}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Phone : {displayStudent.phone}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Address : {displayStudent.address}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Date of Birth : {displayStudent.dob}
            </div>
            <div className="w-full px-4 py-3 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-800 font-medium text-sm">
              Joined Date : {displayStudent.joinedDate}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-8">
          <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Attendance Summary</h3>
            <div className="bg-white rounded-xl p-5 border border-gray-200 mb-4 flex items-center justify-between shadow-sm">
              <span className="text-4xl font-extrabold text-black">{displayStudent.attendanceRate}</span>
              <span className="text-sm font-semibold text-gray-600">Month : {displayStudent.month}</span>
            </div>
            <div className="grid grid-cols-3 text-center pt-2 border-t border-gray-300">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Present Days</p>
                <p className="text-lg font-bold text-black">{displayStudent.presentDays}</p>
              </div>
              <div className="border-x border-gray-300">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Days</p>
                <p className="text-lg font-bold text-black">{displayStudent.totalDays}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Absences</p>
                <p className="text-lg font-bold text-black">{displayStudent.absences}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-200 flex flex-col justify-between">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Summary</h3>
            <div className="py-2 mb-4">
              <div className={`w-full py-4 text-white font-extrabold text-xl rounded-xl text-center shadow-md tracking-wider transition-colors ${displayStudent.paymentStatus.toLowerCase() === 'paid' ? 'bg-[#10B981]' : 'bg-red-500'}`}>
                {displayStudent.paymentStatus}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-300 text-sm font-semibold text-gray-700">
              <span>Paid Date : {displayStudent.paidDate}</span>
              <span>Amount : {displayStudent.amount}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}