import PaymentTable from '../compenent/PaymentTable';

const Payments = () => {
  return (
    <div className="page-content">
      <h1>Payment History</h1>
      
      <div className="stats-grid-light">
        <div className="stat-card-light">
          <h3>Total Payments</h3>
          <h2>126</h2>
          <span style={{fontSize: '12px', color: '#4338ca'}}>All time payments</span>
        </div>
        <div className="stat-card-light">
          <h3>Total Collected</h3>
          <h2>Rs. 285,000</h2>
          <span style={{fontSize: '12px', color: '#16a34a'}}>Successfully received</span>
        </div>
        <div className="stat-card-light">
          <h3>Pending Amount</h3>
          <h2>Rs. 45,000</h2>
          <span style={{fontSize: '12px', color: '#ca8a04'}}>Awaiting payment</span>
        </div>
        <div className="stat-card-light">
          <h3>This Month</h3>
          <h2>Rs. 36,000</h2>
          <span style={{fontSize: '12px', color: '#4338ca'}}>Collected this month</span>
        </div>
      </div>

      <div className="filter-bar">
        <input type="text" placeholder="Search by student name or invoice ID..." />
        <button>Export</button>
      </div>

      <PaymentTable />
    </div>
  );
};

export default Payments;