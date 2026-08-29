import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

const DashboardStats = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyPayments, setMonthlyPayments] = useState(0);

  const [loading, setLoading] = useState(true);

  // Get today's date in YYYY-MM-DD format
  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Get current month
  const getCurrentMonth = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // --------------------------------
        // 1. Get students
        // --------------------------------

        const studentsResponse = await fetch(
          `${API_URL}/students`,
          {
            headers,
          }
        );

        if (!studentsResponse.ok) {
          throw new Error("Failed to fetch students");
        }

        const studentsData = await studentsResponse.json();

        setTotalStudents(studentsData.length);


        // --------------------------------
        // 2. Get today's attendance
        // --------------------------------

        const today = getToday();

        const attendanceResponse = await fetch(
          `${API_URL}/attendance/date/${today}`,
          {
            headers,
          }
        );

        if (!attendanceResponse.ok) {
          throw new Error("Failed to fetch attendance");
        }

        const attendanceData =
          await attendanceResponse.json();

        // Count Present students
        const presentCount = attendanceData.filter(
          (record) => record.status === "Present"
        ).length;

        setPresentToday(presentCount);


        // --------------------------------
        // 3. Get payments
        // --------------------------------

        const paymentsResponse = await fetch(
          `${API_URL}/payments`,
          {
            headers,
          }
        );

        if (!paymentsResponse.ok) {
          throw new Error("Failed to fetch payments");
        }

        const paymentsData =
          await paymentsResponse.json();

        // Your API returns { payments: [...] }
        const payments = paymentsData.payments || [];

        const currentMonth = getCurrentMonth();

        // Filter current month payments
        const currentMonthPayments = payments.filter(
          (payment) =>
            payment.paymentMonth === currentMonth
        );

        // Calculate monthly income
        const income = currentMonthPayments.reduce(
          (total, payment) =>
            total + Number(payment.amount || 0),
          0
        );

        setMonthlyIncome(income);
        setMonthlyPayments(
          currentMonthPayments.length
        );

      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  // --------------------------------
  // Calculate attendance percentage
  // --------------------------------

  const attendancePercentage =
    totalStudents > 0
      ? Math.round(
          (presentToday / totalStudents) * 100
        )
      : 0;


  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">

      {/* -------------------------------- */}
      {/* Total Students */}
      {/* -------------------------------- */}

      <div className="flex flex-col justify-between h-32 rounded-xl bg-slate-800 p-5 text-white">

        <h3 className="text-sm font-normal text-slate-400">
          Total Students
        </h3>

        <h2 className="text-3xl font-bold">
          {loading ? "..." : totalStudents}
        </h2>

        <span className="text-sm text-emerald-500">
          Active
        </span>

      </div>


      {/* -------------------------------- */}
      {/* Present Today */}
      {/* -------------------------------- */}

      <div className="flex flex-col justify-between h-32 rounded-xl bg-slate-800 p-5 text-white">

        <h3 className="text-sm font-normal text-slate-400">
          Present Today
        </h3>

        <h2 className="text-3xl font-bold">
          {loading ? "..." : presentToday}
        </h2>

        <span className="text-sm text-slate-400">
          Attendance: {loading ? "..." : `${attendancePercentage}%`}
        </span>

      </div>


      {/* -------------------------------- */}
      {/* Monthly Income */}
      {/* -------------------------------- */}

      <div className="flex flex-col justify-between h-32 rounded-xl bg-slate-800 p-5 text-white">

        <h3 className="text-sm font-normal text-slate-400">
          Monthly Income
        </h3>

        <h2 className="text-3xl font-bold">
          {loading
            ? "..."
            : `Rs. ${monthlyIncome.toLocaleString()}`}
        </h2>

        <span className="text-sm text-emerald-500">
          {loading
            ? "..."
            : `${monthlyPayments} payments`}
        </span>

      </div>

    </div>
  );
};

export default DashboardStats;