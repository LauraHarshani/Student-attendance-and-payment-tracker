import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  CreditCard,
  DollarSign,
  Clock,
  CalendarDays,
  Download
} from "lucide-react";

const PAYMENT_KEY = "paymentHistory";
const STUDENT_KEY = "studentList";

export default function PaymentHistory() {

  const navigate = useNavigate();

  // LOAD DATA

  const [payments] = useState(() => {
    const saved = localStorage.getItem(PAYMENT_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [students] = useState(() => {
    const saved = localStorage.getItem(STUDENT_KEY);
    return saved ? JSON.parse(saved) : [];
  });


  // Status

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("Current");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 6;


  // CCurrent month

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });


  // Month option

  const paymentMonths = useMemo(() => {

    const months = new Set();

    // Add current month
    months.add(currentMonth);

    // Add months from existing payment records
    payments.forEach((payment) => {

      if (payment.paymentMonth) {
        months.add(payment.paymentMonth);
      }

    });

    // Convert to array
    return Array.from(months).sort((a, b) => {

      const dateA = new Date(`1 ${a}`);
      const dateB = new Date(`1 ${b}`);

      return dateB - dateA;

    });

  }, [payments, currentMonth]);


  // Format date

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

  };


  // Create payment history

  const monthlyRecords = useMemo(() => {

    // return all recorded payments.
    if (monthFilter === "All") {

      return payments.map((payment) => ({
        ...payment,
        status: payment.status || "Paid"
      }));

    }


    // Selected month
    const selectedMonth =
      monthFilter === "Current"
        ? currentMonth
        : monthFilter;


    // Create one record for every student
    return students.map((student) => {

      // Find payment for this student and month
      const payment = payments.find(
        (payment) =>
          payment.studentId === student.id &&
          payment.paymentMonth === selectedMonth
      );


      // Paid

      if (payment) {

        return {
          ...payment,

          studentName:
            payment.studentName || student.name,

          studentId:
            payment.studentId || student.id,

          paymentMonth:
            payment.paymentMonth || selectedMonth,

          status:
            payment.status || "Paid"

        };

      }

      // Pending

      return {

        invoiceNumber: "-",

        studentName: student.name,

        studentId: student.id,

        paymentMonth: selectedMonth,

        paymentDate: "",

        amount: 0,

        status: "Pending"

      };

    });

  }, [
    payments,
    students,
    monthFilter,
    currentMonth
  ]);


  // Search and filters

  const filteredPayments = useMemo(() => {

    return monthlyRecords.filter((payment) => {

      // Search
      const searchText = `
        ${payment.studentName || ""}
        ${payment.studentId || ""}
        ${payment.invoiceNumber || ""}
      `.toLowerCase();

      const matchesSearch =
        searchText.includes(searchTerm.toLowerCase());


      // Status
      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter;


      // Date
      const paymentDate =
        payment.paymentDate || "";


      const matchesFromDate =
        !fromDate ||
        !payment.paymentDate ||
        payment.paymentDate >= fromDate;


      const matchesToDate =
        !toDate ||
        !payment.paymentDate || 
        payment.paymentDate <= toDate;


      return (
        matchesSearch &&
        matchesStatus &&
        matchesFromDate &&
        matchesToDate
      );

    });

  }, [
    monthlyRecords,
    searchTerm,
    statusFilter,
    fromDate,
    toDate
  ]);

  // Download filtered payment history
    const handleDownload = () => {

    // Create summary section
    const summaryRows = [
        ["PAYMENT HISTORY SUMMARY"],
        [],
        ["Total Students", totalPayments],
        ["Total Collected", `Rs. ${totalCollected.toLocaleString()}`],
        ["Pending Payments", pendingRecords.length],
        ["This Month Collected", `Rs. ${thisMonthAmount.toLocaleString()}`],
        [],
        ["FILTERS"],
        ["Month", monthFilter === "Current" ? currentMonth : monthFilter],
        ["Status", statusFilter],
        ["From Date", fromDate || "All"],
        ["To Date", toDate || "All"],
        [],
        ["PAYMENT RECORDS"],
        [
        "Invoice No",
        "Student Name",
        "Student ID",
        "Payment Month",
        "Payment Date",
        "Amount (Rs)",
        "Status"
        ]
    ];

    // Add filtered payment records
    const paymentRows = filteredPayments.map((payment) => [
        payment.invoiceNumber !== "-"
        ? payment.invoiceNumber
        : "-",

        payment.studentName || "-",

        payment.studentId || "-",

        payment.paymentMonth || "-",

        payment.paymentDate
        ? formatDate(payment.paymentDate)
        : "-",

        payment.status === "Paid"
        ? Number(payment.amount || 0).toLocaleString()
        : "-",

        payment.status || "Pending"
    ]);

    // Combine everything
    const csvRows = [
        ...summaryRows,
        ...paymentRows
    ];

    // Convert to CSV
    const csvContent = csvRows
        .map((row) =>
        row
            .map((cell) => {
            const value = String(cell ?? "");

            // Escape commas, quotes and line breaks
            if (
                value.includes(",") ||
                value.includes('"') ||
                value.includes("\n")
            ) {
                return `"${value.replace(/"/g, '""')}"`;
            }

            return value;
            })
            .join(",")
        )
        .join("\n");

    // Create downloadable file
    const blob = new Blob(
        [csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    // File name
    const fileName = `Payment_History_${new Date()
        .toISOString()
        .split("T")[0]}.csv`;

    link.setAttribute("download", fileName);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    };


  // Summery

  const totalPayments =
    filteredPayments.length;


  const paidRecords =
    filteredPayments.filter(
      (payment) => payment.status === "Paid"
    );


  const pendingRecords =
    filteredPayments.filter(
      (payment) => payment.status === "Pending"
    );


  const totalCollected =
    paidRecords.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );


  const pendingAmount =
    pendingRecords.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );


  const thisMonthAmount =
    filteredPayments
      .filter(
        (payment) =>
          payment.status === "Paid" &&
          payment.paymentMonth === currentMonth
      )
      .reduce(
        (total, payment) =>
          total + Number(payment.amount || 0),
        0
      );


  // Pagination

  const totalPages = Math.ceil(
    filteredPayments.length /
      recordsPerPage
  );


  const indexOfLastRecord =
    currentPage * recordsPerPage;


  const indexOfFirstRecord =
    indexOfLastRecord -
    recordsPerPage;


  const currentRecords =
    filteredPayments.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );

  // Reset page when filter change

  const handleSearch = (e) => {

    setSearchTerm(e.target.value);

    setCurrentPage(1);

  };


  const handleStatusChange = (e) => {

    setStatusFilter(e.target.value);

    setCurrentPage(1);

  };


  const handleMonthChange = (e) => {

    setMonthFilter(e.target.value);

    setCurrentPage(1);

  };


  const handleFromDate = (e) => {

    setFromDate(e.target.value);

    setCurrentPage(1);

  };


  const handleToDate = (e) => {

    setToDate(e.target.value);

    setCurrentPage(1);

  };


  // Page

  return (

    <div className="space-y-8">


      {/* Header */}

      <div>

        <button
          onClick={() => navigate("/payments")}
          className="mb-4 text-gray-900 transition-colors hover:text-blue-700"
        >
          <ArrowLeft size={28} />
        </button>


        <h1 className="text-3xl font-bold text-black">
          Payment History
        </h1>


        <p className="mt-1 text-sm text-gray-500">
          View student payment records and payment status.
        </p>

      </div>


      {/* Summery cards */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">


        {/* Total */}

        <div className="rounded-2xl bg-blue-100 p-5">

          <div className="flex items-center gap-3">

            <CreditCard
              size={22}
              className="text-blue-950"
            />

            <span className="text-sm font-semibold text-blue-950">
              Total Students
            </span>

          </div>


          <p className="mt-5 text-2xl font-bold text-blue-950">
            {totalPayments}
          </p>


          <p className="mt-2 text-xs font-medium text-blue-950">
            Payment records
          </p>

        </div>



        {/* Paid */}

        <div className="rounded-2xl bg-green-100 p-5">

          <div className="flex items-center gap-3">

            <DollarSign
              size={22}
              className="text-green-900"
            />

            <span className="text-sm font-semibold text-green-900">
              Total Collected
            </span>

          </div>


          <p className="mt-5 text-2xl font-bold text-green-900">
            Rs. {totalCollected.toLocaleString()}
          </p>


          <p className="mt-2 text-xs font-medium text-green-900">
            Successfully received
          </p>

        </div>



        {/* Pending */}

        <div className="rounded-2xl bg-red-100 p-5">

          <div className="flex items-center gap-3">

            <Clock
              size={22}
              className="text-red-900"
            />

            <span className="text-sm font-semibold text-red-900">
              Pending
            </span>

          </div>


          <p className="mt-5 text-2xl font-bold text-red-900">
            {pendingRecords.length}
          </p>


          <p className="mt-2 text-xs font-medium text-red-900">
            Awaiting payment
          </p>

        </div>



        {/* This Month */}

        <div className="rounded-2xl bg-teal-100 p-5">

          <div className="flex items-center gap-3">

            <CalendarDays
              size={22}
              className="text-teal-900"
            />

            <span className="text-sm font-semibold text-teal-900">
              This Month
            </span>

          </div>


          <p className="mt-5 text-2xl font-bold text-teal-900">
            Rs. {thisMonthAmount.toLocaleString()}
          </p>


          <p className="mt-2 text-xs font-medium text-teal-900">
            Collected this month
          </p>

        </div>

      </div>

      {/* Filters */}

      <div className="flex flex-col gap-3 lg:flex-row">


        {/* Search */}

        <div className="relative w-full lg:w-80">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />


          <input
            type="text"
            placeholder="Search by name, ID or invoice"
            value={searchTerm}
            onChange={handleSearch}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            "
          />

        </div>


        {/* Month filters */}

        <select
          value={monthFilter}
          onChange={handleMonthChange}
          className="
            h-11
            min-w-48
            rounded-lg
            border
            border-gray-300
            bg-white
            px-4
            text-sm
            text-gray-700
            outline-none
            transition
            focus:border-blue-500
            focus:ring-1
            focus:ring-blue-500
          "
        >

          <option value="Current">
            Current Month
          </option>

          <option value="All">
            All Months
          </option>


          {paymentMonths.map((month) => (

            <option
              key={month}
              value={month}
            >
              {month}
            </option>

          ))}

        </select>

        {/* Status filter */}

        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="
            h-11
            min-w-40
            rounded-lg
            border
            border-gray-300
            bg-white
            px-4
            text-sm
            text-gray-700
            outline-none
            transition
            focus:border-blue-500
            focus:ring-1
            focus:ring-blue-500
          "
        >

          <option value="All">
            All Status
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Pending">
            Pending
          </option>

        </select>


        <div className="flex flex-col lg:flex-row lg:items-center gap-3 ml-5">
            <div className="flex gap-2 items-center">
               {/* From Date */}
                <label>
                    From
                </label>

                <input
                type="date"
                value={fromDate}
                onChange={handleFromDate}
                className="
                    h-11
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-4
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500
                "
                />
            </div>

            <div className="flex gap-2 items-center">

                {/* To Date */}

                <label>To</label>

                <input
                type="date"
                value={toDate}
                onChange={handleToDate}
                className="
                    h-11
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-4
                    text-sm
                    text-gray-700
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500
                "
                />
            </div>
        </div>

      </div>



      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full border-collapse text-sm">

          <thead>

            <tr className="border-y border-gray-300 bg-gray-50 text-left">


              <th className="px-4 py-3 font-semibold text-gray-800">
                Invoice No
              </th>


              <th className="px-4 py-3 font-semibold text-gray-800">
                Student Name
              </th>


              <th className="px-4 py-3 font-semibold text-gray-800">
                Student ID
              </th>


              <th className="px-4 py-3 font-semibold text-gray-800">
                Payment Month
              </th>


              <th className="px-4 py-3 font-semibold text-gray-800">
                Payment Date
              </th>


              <th className="px-4 py-3 font-semibold text-gray-800">
                Amount (Rs)
              </th>


              <th className="px-4 py-3 font-semibold text-gray-800">
                Status
              </th>

            </tr>

          </thead>



          <tbody>

            {currentRecords.length > 0 ? (

              currentRecords.map(
                (payment, index) => (

                  <tr
                    key={
                      payment.invoiceNumber !== "-"
                        ? payment.invoiceNumber
                        : `${payment.studentId}-${payment.paymentMonth}-${index}`
                    }
                    className="border-b border-gray-200"
                  >


                    {/* Invoice */}

                    <td className="px-4 py-4 font-medium">

                      {payment.invoiceNumber !== "-"
                        ? (
                          <span className="text-blue-700">
                            {payment.invoiceNumber}
                          </span>
                        )
                        : (
                          <span className="text-gray-400">
                            -
                          </span>
                        )}

                    </td>



                    {/* Student Name */}

                    <td className="px-4 py-4 text-gray-800">

                      {payment.studentName || "-"}

                    </td>



                    {/* Student ID */}

                    <td className="px-4 py-4 text-gray-700">

                      {payment.studentId || "-"}

                    </td>



                    {/* Payment Month */}

                    <td className="px-4 py-4 text-gray-700">

                      {payment.paymentMonth || "-"}

                    </td>



                    {/* Payment Date */}

                    <td className="px-4 py-4 text-gray-700">

                      {formatDate(
                        payment.paymentDate
                      )}

                    </td>



                    {/* Amount */}

                    <td className="px-4 py-4 text-gray-700">

                      {payment.status === "Paid"
                        ? `Rs. ${Number(
                            payment.amount || 0
                          ).toLocaleString()}`
                        : "-"}

                    </td>



                    {/* Status */}

                    <td className="px-4 py-4">

                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-medium

                          ${
                            payment.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        `}
                      >

                        {payment.status || "Pending"}

                      </span>

                    </td>

                  </tr>

                )

              )

            ) : (

              <tr>

                <td
                  colSpan="7"
                  className="py-10 text-center text-sm text-gray-500"
                >
                  No payment records found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* Pagination */}

      <div className="flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">


        {/* Record count */}

         <button
      type="button"
      onClick={handleDownload}
      disabled={filteredPayments.length === 0}
      className="flex w-fit items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
    >

      <Download size={18} />

      Report

    </button>



        {/* Pagination */}

        {totalPages > 0 && (

          <div className="flex items-center gap-2">


            {/* Previous */}

            <button
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
              disabled={currentPage === 1}
              className="
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-1.5
                text-gray-600
                transition
                hover:bg-gray-100
              "
            >
              ‹
            </button>



            {/* Page Numbers */}

            {Array.from(
              {
                length: totalPages
              },
              (_, index) =>
                index + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`
                  rounded-lg
                  px-3.5
                  py-1.5
                  text-sm

                  ${
                    currentPage === page
                      ? "bg-blue-700 font-bold text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }
                `}
              >

                {page}

              </button>

            ))}



            {/* Next */}

            <button
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage === totalPages
              }
              className="
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-1.5
                text-gray-600
                transition
                hover:bg-gray-100
              "
            >
              ›
            </button>

          </div>

        )}

      </div>

    </div>

  );

}