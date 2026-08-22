const PaymentDoughnutChart = () => {
  const legend = [
    { label: 'Jan - Rs. 5,000', color: '#4f46e5' },
    { label: 'Feb - Rs. 4,000', color: '#3b82f6' },
    { label: 'Mar - Rs. 6,000', color: '#06b6d4' },
    { label: 'Apr - Rs. 5,500', color: '#8b5cf6' },
    { label: 'May - Rs. 7,000', color: '#a855f7' },
    { label: 'Jun - Rs. 6,500', color: '#d946ef' },
  ];

  return (
    <div role="img" aria-label="Payment collection overview" className="flex min-h-[220px] items-center justify-evenly gap-5">
      <div
        className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full"
        style={{
          background:
            'conic-gradient(#4f46e5 0 15%, #3b82f6 15% 27%, #06b6d4 27% 45%, #8b5cf6 45% 61%, #a855f7 61% 82%, #d946ef 82% 100%)',
        }}
      >
        <div className="absolute h-[92px] w-[92px] rounded-full bg-slate-800" />
        <div className="relative z-10 flex flex-col items-center">
          <strong className="text-xl text-white">34K</strong>
          <span className="text-[11px] text-slate-400">Collected</span>
        </div>
      </div>

      <div className="grid gap-2 text-[11px] text-slate-300">
        {legend.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <i
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};
export default PaymentDoughnutChart;