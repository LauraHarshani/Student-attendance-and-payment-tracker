import DashboardStats from '../compenent/DashboardStats';
import AttendanceBarChart from '../compenent/AttendanceBarChart';
import PaymentDoughnutChart from '../compenent/PaymentDoughnutChart';

const Dashboard = () => {
  return (
    <div className="page-content">
      <h1>Dashboard</h1>
      <DashboardStats />
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Monthly Attendance Overview</h3>
          <AttendanceBarChart />
        </div>
        <div className="chart-container">
          <h3>Payment Collection Overview</h3>
          <PaymentDoughnutChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;