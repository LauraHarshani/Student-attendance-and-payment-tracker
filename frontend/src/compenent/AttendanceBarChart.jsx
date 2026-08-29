import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

const AttendanceBarChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/attendance/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance");
        }

        const records = await response.json();

        // Get current year
        const currentYear = new Date().getFullYear();

        // Create 12 months
        const months = Array.from(
          { length: 12 },
          (_, index) => ({
            name: new Date(
              currentYear,
              index,
              1
            ).toLocaleDateString("en-US", {
              month: "short",
            }),
            monthIndex: index,
            present: 0,
            absent: 0,
          })
        );

        // Count attendance records
        records.forEach((record) => {
          const date = new Date(record.date);

          // Only current year
          if (date.getFullYear() !== currentYear) {
            return;
          }

          const monthIndex = date.getMonth();

          if (record.status === "Present") {
            months[monthIndex].present++;
          }

          if (record.status === "Absent") {
            months[monthIndex].absent++;
          }
        });

        setMonthlyData(months);
      } catch (error) {
        console.error(
          "Failed to load attendance chart:",
          error
        );

        setMonthlyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <p className="text-sm text-slate-400">
          Loading attendance...
        </p>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label="Monthly attendance overview"
      className="min-h-[220px]"
    >
      {/* Chart */}
      <div className="flex h-[180px] items-end justify-around border-b border-slate-600">
        {monthlyData.map((month) => (
          <div
            key={month.name}
            className="flex flex-col items-center gap-2 text-xs text-slate-400"
          >
            {/* Bars */}
            <div className="flex h-[150px] items-end gap-1">

              {/* Present */}
              <span
                className="block w-3 rounded-t-sm bg-indigo-600"
                style={{
                  height:
                    month.present === 0
                      ? "0px"
                      : `${Math.min(
                          month.present * 7,
                          150
                        )}px`,
                }}
                title={`Present: ${month.present}`}
              />

              {/* Absent */}
              <span
                className="block w-3 rounded-t-sm bg-red-500"
                style={{
                  height:
                    month.absent === 0
                      ? "0px"
                      : `${Math.min(
                          month.absent * 7,
                          150
                        )}px`,
                }}
                title={`Absent: ${month.absent}`}
              />

            </div>

            {/* Month */}
            <span>{month.name}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
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