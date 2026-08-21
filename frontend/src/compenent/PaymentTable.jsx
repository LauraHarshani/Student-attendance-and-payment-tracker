
const PaymentTable = () => {
  const payments = [
    { id: 'INV-2024-126', name: 'Nimal Perera', date: '20 May 2024', amount: 'Rs. 5,000', method: 'Cash', status: 'Paid' },
    { id: 'INV-2024-125', name: 'Sadee Fernando', date: '19 May 2024', amount: 'Rs. 6,000', method: 'Bank Transfer', status: 'Paid' },
    { id: 'INV-2024-123', name: 'Hasini Dissanayake', date: '17 May 2024', amount: 'Rs. 5,000', method: 'Cash', status: 'Pending' },
  ];

  return (
    <div className="table-container">
      <table className="payment-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Student Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, index) => (
            <tr key={index}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.date}</td>
              <td>{p.amount}</td>
              <td><span className={`badge ${p.method}`}>{p.method}</span></td>
              <td><span className={`badge ${p.status}`}>{p.status}</span></td>
              <td>...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default PaymentTable;