import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, CreditCard, User, LogOut } from 'lucide-react';
import logoImage from '../assets/logo.jpeg'; 

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]); 
  
  // State to save read notification IDs (uses localStorage to persist across page refreshes)
  const [readNotifs, setReadNotifs] = useState(() => {
    const saved = localStorage.getItem('readNotifications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const userName = localStorage.getItem('userName') || 'Harshani';
  const userInitial = userName.charAt(0).toUpperCase();

  // Fetch real data from the backend when the component mounts
  useEffect(() => {
    fetchRealNotifications();
  }, []);

  const fetchRealNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        let generatedNotifications = [];
        
        // 1. Newly added students (get the last 3 registered students)
        const latestStudents = [...data].reverse().slice(0, 3);
        latestStudents.forEach(student => {
          generatedNotifications.push({
            id: `reg_${student._id}`,
            text: `New student ${student.name} just registered.`
          });
        });

        // 2. Payments (get the last 3 students with a 'Paid' payment status)
        const paidStudents = data.filter(s => s.payment === 'Paid').reverse().slice(0, 3);
        paidStudents.forEach(student => {
          generatedNotifications.push({
            id: `pay_${student._id}`,
            text: `Payment received for ${student.name}.`
          });
        });

        setNotifications(generatedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Function to mark a notification as read when it is clicked
  const markAsRead = (id) => {
    if (!readNotifs.includes(id)) {
      const updatedReadList = [...readNotifs, id];
      setReadNotifs(updatedReadList);
      localStorage.setItem('readNotifications', JSON.stringify(updatedReadList));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userName'); 
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  // Function to check if a navigation link is currently active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Count the number of unread notifications
  const unreadCount = notifications.filter(note => !readNotifs.includes(note.id)).length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A1128] text-white flex flex-col">
        <div className="p-6 flex flex-col items-center border-b border-slate-700/50">
          <img 
            src={logoImage} 
            alt="Student Tracker Logo" 
            className="w-20 h-auto mb-3 object-contain mix-blend-lighten" 
          />
          <h2 className="text-xl font-extrabold tracking-wide text-center">
            Student Tracker
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link to="/" className={`flex items-center gap-4 p-3.5 rounded-xl font-medium transition-all ${isActive('/') ? 'bg-[#3b4b94] text-white shadow-lg' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={22} /> Dashboard
          </Link>
          <Link to="/students" className={`flex items-center gap-4 p-3.5 rounded-xl font-medium transition-all ${isActive('/students') ? 'bg-[#3b4b94] text-white shadow-lg' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}>
            <Users size={22} /> Students
          </Link>
          <Link to="/attendance" className={`flex items-center gap-4 p-3.5 rounded-xl font-medium transition-all ${isActive('/attendance') ? 'bg-[#3b4b94] text-white shadow-lg' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}>
            <Calendar size={22} /> Attendance
          </Link>
          <Link to="/payments" className={`flex items-center gap-4 p-3.5 rounded-xl font-medium transition-all ${isActive('/payments') ? 'bg-[#3b4b94] text-white shadow-lg' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}>
            <CreditCard size={22} /> Payments
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700/50 space-y-2 mb-2">
          <Link to="/admin-profile" className={`flex items-center gap-4 p-3.5 rounded-xl font-medium transition-all ${isActive('/admin-profile') ? 'bg-[#3b4b94] text-white shadow-lg' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}>
            <User size={22} /> Admin Profile
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-4 w-full p-3.5 rounded-xl font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all text-left">
            <LogOut size={22} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Welcome Back, {userName}!</h1>
          <div className="flex items-center gap-5">
            
            {/* Notifications Section */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                {/* Display only the unread count in red */}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border border-white">
                    {unreadCount}
                  </span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 font-bold text-gray-800 flex justify-between items-center">
                    Notifications
                    {unreadCount > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((note) => {
                        const isRead = readNotifs.includes(note.id);
                        return (
                          <div 
                            key={note.id} 
                            onClick={() => markAsRead(note.id)}
                            className={`px-4 py-3 border-b border-gray-50 text-sm cursor-pointer transition-colors flex gap-3 items-start ${isRead ? 'bg-white text-gray-500' : 'bg-blue-50/30 hover:bg-blue-50/60 text-gray-800'}`}
                          >
                             {/* Show the blue dot indicator only if the notification is unread */}
                             {!isRead && <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>}
                             <div className={isRead ? '' : 'font-semibold'}>{note.text}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-11 h-11 rounded-full bg-[#0A1128] shadow-md text-white flex items-center justify-center font-bold text-xl cursor-pointer hover:bg-blue-700 transition-colors">
              {userInitial}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}