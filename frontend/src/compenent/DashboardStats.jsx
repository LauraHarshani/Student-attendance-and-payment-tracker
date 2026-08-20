
const DashboardStats = () => {
  return (
    <div className="stats-grid">
      <div className="dark-card">
        <h3>Total Students</h3>
        <h2>12</h2>
        <span style={{color: '#10b981'}}>Active</span>
      </div>
      <div className="dark-card">
        <h3>Present Today</h3>
        <h2>9</h2>
        <span style={{color: '#94a3b8'}}>Target: 95%</span>
      </div>
      <div className="dark-card">
        <h3>Monthly Income</h3>
        <h2>Rs. 36,000</h2>
        <span style={{color: '#10b981'}}>100% Paid</span>
      </div>
    </div>
  );
};
export default DashboardStats;