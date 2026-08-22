const AttendanceBarChart = () => {
  const months = [
    { name: 'Jan', present: 10, absent: 2 },
    { name: 'Feb', present: 8, absent: 4 },
    { name: 'Mar', present: 12, absent: 1 },
    { name: 'Apr', present: 9, absent: 3 },
    { name: 'May', present: 11, absent: 2 },
    { name: 'Jun', present: 10, absent: 3 },
  ];

  return (
    <div role="img" aria-label="Monthly attendance overview" className="min-h-[220px]">
      <div className="flex h-[180px] items-end justify-around border-b border-slate-600">
        {months.map((month) => (
          <div key={month.name} className="flex flex-col items-center gap-2 text-xs text-slate-400">
            <div className="flex h-[150px] items-end gap-1">
              <span
                className="block w-3 rounded-t-sm bg-indigo-600"
                style={{ height: `${month.present * 7}px` }}
              />
              <span
                className="block w-3 rounded-t-sm bg-red-500"
                style={{ height: `${month.absent * 7}px` }}
              />
            </div>
            <span>{month.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-5 text-xs text-slate-300">
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-2 w-2 rounded-full bg-indigo-600" />
          Present
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-2 w-2 rounded-full bg-red-500" />
          Absent
        </span>
      </div>
    </div>
  );
};
export default AttendanceBarChart;