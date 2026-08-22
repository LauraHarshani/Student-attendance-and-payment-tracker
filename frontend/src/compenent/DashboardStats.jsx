const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
      <div className="flex flex-col justify-between h-32 rounded-xl bg-slate-800 p-5 text-white">
        <h3 className="text-sm font-normal text-slate-400">Total Students</h3>
        <h2 className="text-3xl font-bold">12</h2>
        <span className="text-sm text-emerald-500">Active</span>
      </div>

      <div className="flex flex-col justify-between h-32 rounded-xl bg-slate-800 p-5 text-white">
        <h3 className="text-sm font-normal text-slate-400">Present Today</h3>
        <h2 className="text-3xl font-bold">9</h2>
        <span className="text-sm text-slate-400">Target: 95%</span>
      </div>

      <div className="flex flex-col justify-between h-32 rounded-xl bg-slate-800 p-5 text-white">
        <h3 className="text-sm font-normal text-slate-400">Monthly Income</h3>
        <h2 className="text-3xl font-bold">Rs. 36,000</h2>
        <span className="text-sm text-emerald-500">100% Paid</span>
      </div>
    </div>
  );
};
export default DashboardStats;