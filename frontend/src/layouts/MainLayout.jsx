import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, CreditCard, User, LogOut } from 'lucide-react';
import logoImage from '../assets/logo.jpeg'; 

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const userName = localStorage.getItem('userName') || 'Harshani';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('userName'); 
    navigate('/login');
  };

  // ලින්ක් එකක් ඇක්ටිව් ද (දැනට ඉන්න පේජ් එකද) කියලා බලන ෆන්ක්ෂන් එක
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar -  */}
      <aside className="w-64 bg-[#0A1128] text-white flex flex-col">
        
        {/* Logo & Title Section */}
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
          <Link 
            to="/" 
            className={`flex items-center gap-4 p-3.5 rounded-xl font-medium transition-all ${isActive('/') ? 'bg-[#3b4b94] text-white shadow-lg' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={22} /> Dashboard
          </Link>
          <Link 
            to="/students" 
            className={`flex items-center gap-4 p-3.5 rounded-xl font-medium transition-all ${isActive('/students') ? 'bg-[#3b4b94] text-white shadow-lg' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={22} /> Students
          </Link>
          <Link 
            to="/attendance" 
            className={`flex items-center gap-4 p-3.5 rounded-xl font-medium transition-all ${isActive('/attendance') ? 'bg-[#3b4b94] text-white shadow-lg' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Calendar size={22} /> Attendance
          </Link>
          <Link 
            to="/payments" 
            className={`flex items-center gap-4 p-3.5 rounded-xl font-medium transition-all ${isActive('/payments') ? 'bg-[#3b4b94] text-white shadow-lg' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <CreditCard size={22} /> Payments
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700/50 space-y-2 mb-2">
          <Link 
            to="/admin-profile" 
            className={`flex items-center gap-4 p-3.5 rounded-xl font-medium transition-all ${isActive('/admin-profile') ? 'bg-[#3b4b94] text-white shadow-lg' : 'text-gray-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <User size={22} /> Admin Profile
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-3.5 rounded-xl font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all text-left"
          >
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
            <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
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