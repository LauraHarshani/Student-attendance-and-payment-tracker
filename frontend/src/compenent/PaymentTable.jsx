const badgeStyles = {
  Cash: 'bg-green-100 text-green-700',
  Paid: 'bg-green-100 text-green-700',
  'Bank Transfer': 'bg-blue-100 text-blue-700',
  Card: 'bg-purple-100 text-purple-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
};

const PaymentTable = () => {
  const payments = [
    { id: 'INV-2024-126', name: 'Nimal Perera', date: '20 May 2024', amount: 'Rs. 5,000', method: 'Cash', status: 'Paid' },
    { id: 'INV-2024-125', name: 'Sadee Fernando', date: '19 May 2024', amount: 'Rs. 6,000', method: 'Bank Transfer', status: 'Paid' },
    { id: 'INV-2024-123', name: 'Hasini Dissanayake', date: '17 May 2024', amount: 'Rs. 5,000', method: 'Cash', status: 'Pending' },
  ];

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-5 py-4 text-xs font-semibold text-gray-600">Invoice ID</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-600">Student Name</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-600">Date</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-600">Amount</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-600">Method</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-600">Status</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="px-5 py-4 text-gray-700">{p.id}</td>
              <td className="px-5 py-4 text-gray-700">{p.name}</td>
              <td className="px-5 py-4 text-gray-700">{p.date}</td>
              <td className="px-5 py-4 text-gray-700">{p.amount}</td>
              <td className="px-5 py-4">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[p.method]}`}>
                  {p.method}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[p.status]}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-5 py-4 text-gray-700">...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default PaymentTable;