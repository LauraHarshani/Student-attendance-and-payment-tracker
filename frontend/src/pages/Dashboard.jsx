import DashboardStats from '../compenent/DashboardStats';
import AttendanceBarChart from '../compenent/AttendanceBarChart';
import PaymentDoughnutChart from '../compenent/PaymentDoughnutChart';

const Dashboard = () => {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-800">Dashboard</h1>
      <DashboardStats />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl bg-slate-800 p-5 text-white">
          <h3 className="mb-4 text-sm text-slate-400">Monthly Attendance Overview</h3>
          <AttendanceBarChart />
        </div>
        <div className="rounded-xl bg-slate-800 p-5 text-white">
          <h3 className="mb-4 text-sm text-slate-400">Payment Collection Overview</h3>
          <PaymentDoughnutChart />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;