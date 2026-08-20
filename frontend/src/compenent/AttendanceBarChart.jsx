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
    <div className="attendance-chart" role="img" aria-label="Monthly attendance overview">
      <div className="attendance-bars">
        {months.map((month) => (
          <div className="attendance-month" key={month.name}>
            <div className="attendance-columns">
              <span className="attendance-bar present" style={{ height: `${month.present * 7}px` }} />
              <span className="attendance-bar absent" style={{ height: `${month.absent * 7}px` }} />
            </div>
            <span>{month.name}</span>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <span><i className="legend-dot present" />Present</span>
        <span><i className="legend-dot absent" />Absent</span>
      </div>
    </div>
  );
};
export default AttendanceBarChart;