import React, { useEffect, useState } from "react";

const PaymentDoughnutChart = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = [
    "#4f46e5",
    "#3b82f6",
    "#06b6d4",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
    "#6366f1",
    "#ec4899",
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/payments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }

        const data = await response.json();

        setPayments(data.payments || []);
      } catch (error) {
        console.error(
          "Failed to load payment chart:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // --------------------------------
  // Create monthly payment data
  // --------------------------------

  const monthlyData = {};

  payments.forEach((payment) => {
    if (!payment.paymentMonth) return;

    const month = payment.paymentMonth;

    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }

    monthlyData[month] += Number(payment.amount || 0);
  });

  const chartData = Object.entries(monthlyData);

  // --------------------------------
  // Total collected
  // --------------------------------

  const totalCollected = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  // --------------------------------
  // Create conic gradient
  // --------------------------------

  const total = chartData.reduce(
    (sum, [, amount]) => sum + amount,
    0
  );

  let currentPercentage = 0;

  const gradientParts = chartData.map(
    ([, amount], index) => {
      const percentage =
        total > 0
          ? (amount / total) * 100
          : 0;

      const start = currentPercentage;

      currentPercentage += percentage;

      const end = currentPercentage;

      return `${colors[index % colors.length]} ${start}% ${end}%`;
    }
  );

  const chartGradient =
    chartData.length > 0
      ? `conic-gradient(${gradientParts.join(", ")})`
      : "#e5e7eb";


  return (
    <div
      role="img"
      aria-label="Payment collection overview"
      className="flex min-h-[220px] items-center justify-evenly gap-5"
    >

      {/* Doughnut */}

      <div
        className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full"
        style={{
          background: chartGradient,
        }}
      >

        {/* Inner circle */}

        <div className="absolute h-[92px] w-[92px] rounded-full bg-slate-800" />

        {/* Center text */}

        <div className="relative z-10 flex flex-col items-center">

          <strong className="text-xl text-white">
            {loading
              ? "..."
              : `${(totalCollected / 1000).toFixed(0)}K`}
          </strong>

          <span className="text-[11px] text-slate-400">
            Collected
          </span>

        </div>

      </div>


      {/* Legend */}

      <div className="grid max-h-[180px] gap-2 overflow-y-auto text-[11px] text-slate-300">

        {chartData.length === 0 ? (

          <span className="text-slate-400">
            No payment data
          </span>

        ) : (

          chartData.map(
            ([month, amount], index) => (

              <span
                key={month}
                className="flex items-center gap-1.5"
              >

                <i
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      colors[
                        index % colors.length
                      ],
                  }}
                />

                {month} - Rs.{" "}
                {amount.toLocaleString()}

              </span>

            )
          )

        )}

      </div>

    </div>
  );
};

export default PaymentDoughnutChart;