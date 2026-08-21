import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaClipboardList, FaMoneyBillWave, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo-section">
        <h2>Student Tracker</h2>
      </div>
      <nav>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}><FaHome /> Dashboard</Link>
        <Link to="/payments" className={location.pathname === '/payments' ? 'active' : ''}><FaMoneyBillWave /> Payments</Link>
        <Link to="#"><FaUserGraduate /> Students</Link>
        <Link to="#"><FaClipboardList /> Attendance</Link>
      </nav>
      <div className="sidebar-footer">
        <Link to="#"><FaUser /> Admin Profile</Link>
        <Link to="#"><FaSignOutAlt /> Logout</Link>
      </div>
    </div>
  );
};

export default Sidebar;