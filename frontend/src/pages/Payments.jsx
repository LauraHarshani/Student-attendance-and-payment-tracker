import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  DollarSign,
  History,
  Search,
  Users,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function Payments() {
  const navigate = useNavigate();

  // States

  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [paymentData, setPaymentData] = useState({
    paymentMonth: "",
    paymentDate: "",
    amount: "",
  });

  const studentsPerPage = 10;

  // Get current month

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Get today's date

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Payment months

  const getPaymentMonths = () => {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 12 }, (_, index) => {
      return new Date(currentYear, index, 1).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      );
    });
  };

  const paymentMonths = getPaymentMonths();

  // Load students

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoadingStudents(true);

        const response = await fetch(`${API_URL}/students`);

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();

        setStudents(data);
      } catch (error) {
        console.error("Error loading students:", error);
        setStudents([]);

        alert("Failed to load students.");
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, []);

  // Load payments

  const loadPayments = async () => {
    try {
      setLoadingPayments(true);

      const response = await fetch(`${API_URL}/payments`);

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();

      setPayments(data.payments || []);
    } catch (error) {
      console.error("Error loading payments:", error);

      setPayments([]);

      alert("Failed to load payments.");
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Open payment popup

  const openPaymentPopup = (student) => {
    setSelectedStudent(student);

    setPaymentData({
      paymentMonth: getCurrentMonth(),
      paymentDate: getToday(),
      amount: "",
    });

    setShowPaymentPopup(true);
  };

  // Close payment popup

  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
    setSelectedStudent(null);

    setPaymentData({
      paymentMonth: getCurrentMonth(),
      paymentDate: getToday(),
      amount: "",
    });
  };

  // Open payment details

  const openDetailsPopup = (payment, student) => {
    setSelectedPayment({
      ...payment,
      studentName: student?.name || "Unknown Student",
    });

    setShowDetailsPopup(true);
  };

  // Close payment details

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedPayment(null);
  };

  // Search students

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.idNumber}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination

  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  const indexOfLastStudent = currentPage * studentsPerPage;

  const indexOfFirstStudent =
    indexOfLastStudent - studentsPerPage;

  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Get student's payment for current month

  const getStudentPayment = (idNumber) => {
    return payments.find(
      (payment) =>
        payment.idNumber === idNumber &&
        payment.paymentMonth === getCurrentMonth()
    );
  };

  // Generate invoice number

  const generateInvoiceNumber = () => {
    const currentYear = new Date().getFullYear();

    const invoiceNumber = `INV-${currentYear}-${String(
      payments.length + 1
    ).padStart(3, "0")}`;

    return invoiceNumber;
  };

  // Confirm payment

  const handleConfirmPayment = async () => {
    // Validate student
    if (!selectedStudent) {
      alert("Student not selected.");
      return;
    }

    // Validate amount
    if (
      !paymentData.amount ||
      Number(paymentData.amount) <= 0
    ) {
      alert("Please enter a valid payment amount.");
      return;
    }

    // Validate date
    if (!paymentData.paymentDate) {
      alert("Please select the payment date.");
      return;
    }

    // Validate month
    if (!paymentData.paymentMonth) {
      alert("Please select the payment month.");
      return;
    }

    // Check duplicate payment
    const alreadyPaid = payments.some(
      (payment) =>
        payment.idNumber === selectedStudent.idNumber &&
        payment.paymentMonth === paymentData.paymentMonth
    );

    if (alreadyPaid) {
      alert(
        `${selectedStudent.name} has already paid for ${paymentData.paymentMonth}.`
      );

      return;
    }

    try {
      const invoiceNumber = generateInvoiceNumber();

      const payment = {
        invoiceNumber: invoiceNumber,

        idNumber: selectedStudent.idNumber,

        amount: Number(paymentData.amount),

        paymentMonth: paymentData.paymentMonth,

        paymentDate: paymentData.paymentDate,

        status: "Paid",
      };

      const response = await fetch(`${API_URL}/payments`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payment),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create payment"
        );
      }

      alert("Payment recorded successfully!");

      // Reload payments from MongoDB
      await loadPayments();

      // Close popup
      closePaymentPopup();
    } catch (error) {
      console.error("Error creating payment:", error);

      alert(
        error.message || "Failed to record payment."
      );
    }
  };

  // Summary

  const currentMonth = getCurrentMonth();

  const currentMonthPayments = payments.filter(
    (payment) =>
      payment.paymentMonth === currentMonth
  );

  const paidStudents = currentMonthPayments.length;

  const pendingStudents = Math.max(
    students.length - paidStudents,
    0
  );

  const totalCollected = currentMonthPayments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  // Format date

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const dateParts = date.split("-");

    if (dateParts.length !== 3) {
      return date;
    }

    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const day = Number(dateParts[2]);

    return new Date(
      year,
      month - 1,
      day
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Loading

  if (loadingStudents || loadingPayments) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading payments...
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-black">
            Payments
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Manage student payments
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/payment/history")
          }
          className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          <History size={18} />
          History
        </button>

      </div>


      {/* Summary Cards */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <div className="rounded-2xl bg-blue-100 p-5">

          <div className="flex items-center gap-3">

            <Users
              size={22}
              className="text-blue-950"
            />

            <span className="text-sm font-semibold text-blue-950">
              Total
            </span>

          </div>

          <p className="mt-5 text-2xl font-bold text-blue-950">
            {students.length}
          </p>

          <p className="mt-2 text-xs font-medium text-blue-950">
            Students registered
          </p>

        </div>


        {/* Paid */}

        <div className="rounded-2xl bg-green-100 p-5">

          <div className="flex items-center gap-3">

            <Check
              size={22}
              className="text-green-900"
            />

            <span className="text-sm font-semibold text-green-900">
              Paid
            </span>

          </div>

          <p className="mt-5 text-2xl font-bold text-green-900">
            {paidStudents}
          </p>

          <p className="mt-2 text-xs font-medium text-green-900">
            Payments received
          </p>

        </div>


        {/* Pending */}

        <div className="rounded-2xl bg-red-100 p-5">

          <div className="flex items-center gap-3">

            <X
              size={22}
              className="text-red-900"
            />

            <span className="text-sm font-semibold text-red-900">
              Pending
            </span>

          </div>

          <p className="mt-5 text-2xl font-bold text-red-900">
            {pendingStudents}
          </p>

          <p className="mt-2 text-xs font-medium text-red-900">
            Awaiting payments
          </p>

        </div>


        {/* Total Collected */}

        <div className="rounded-2xl bg-teal-100 p-5">

          <div className="flex items-center gap-3">

            <DollarSign
              size={22}
              className="text-teal-900"
            />

            <span className="text-sm font-semibold text-teal-900">
              Total Collected
            </span>

          </div>

          <p className="mt-5 text-2xl font-bold text-teal-900">
            Rs. {totalCollected.toLocaleString()}
          </p>

          <p className="mt-2 text-xs font-medium text-teal-900">
            Successfully received
          </p>

        </div>

      </div>


      {/* Payment Section */}

      <div className="mt-8">

        <h2 className="mb-6 text-lg font-semibold text-black">
          Students payments for this month
        </h2>


        {/* Search */}

        <div className="relative mb-6 w-full sm:w-80">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search students by Name or ID"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

        </div>


        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full border-collapse text-sm">

            <thead>

              <tr className="border-y border-gray-300 bg-gray-50 text-left">

                <th className="px-3 py-3 font-semibold text-gray-800">
                  Student Name
                </th>

                <th className="px-3 py-3 font-semibold text-gray-800">
                  Student ID
                </th>

                <th className="px-3 py-3 font-semibold text-gray-800">
                  Payment Date
                </th>

                <th className="px-3 py-3 font-semibold text-gray-800">
                  Amount (Rs)
                </th>

                <th className="px-3 py-3 font-semibold text-gray-800">
                  Status
                </th>

                <th className="px-3 py-3 text-center font-semibold text-gray-800">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {currentStudents.map((student) => {

                const studentPayment =
                  getStudentPayment(
                    student.idNumber
                  );

                const isPaid =
                  Boolean(studentPayment);

                return (

                  <tr
                    key={student.idNumber}
                    className="border-b border-gray-200"
                  >

                    {/* Student Name */}

                    <td className="px-3 py-4 text-gray-800">
                      {student.name}
                    </td>


                    {/* Student ID */}

                    <td className="px-3 py-4 text-gray-700">
                      {student.idNumber}
                    </td>


                    {/* Payment Date */}

                    <td className="px-3 py-4 text-gray-700">

                      {isPaid
                        ? formatDate(
                            studentPayment.paymentDate
                          )
                        : "-"
                      }

                    </td>


                    {/* Amount */}

                    <td className="px-3 py-4 text-gray-700">

                      {isPaid
                        ? Number(
                            studentPayment.amount
                          ).toLocaleString()
                        : "-"
                      }

                    </td>


                    {/* Status */}

                    <td className="px-3 py-4">

                      {isPaid ? (

                        <span className="inline-flex rounded-full bg-green-100 px-6 py-1 text-xs font-medium text-green-700">
                          Paid
                        </span>

                      ) : (

                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                          Pending
                        </span>

                      )}

                    </td>


                    {/* Action */}

                    <td className="px-3 py-4 text-center">

                      {isPaid ? (

                        <button
                          type="button"
                          onClick={() =>
                            openDetailsPopup(
                              studentPayment,
                              student
                            )
                          }
                          className="rounded-lg border border-blue-600 px-5 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                        >
                          View
                        </button>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            openPaymentPopup(student)
                          }
                          className="rounded-lg bg-blue-700 px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
                        >
                          Pay
                        </button>

                      )}

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>


          {/* No students */}

          {filteredStudents.length === 0 && (

            <div className="py-10 text-center text-sm text-gray-500">
              No students found.
            </div>

          )}

        </div>


        {/* Pagination */}

        {totalPages > 0 && (

          <div className="mt-5 flex items-center justify-end gap-2">

            {/* Previous */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(page - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹
            </button>


            {/* Page Numbers */}

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`rounded px-3.5 py-1.5 font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#4F46E5] font-bold text-white shadow-sm"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>

            ))}


            {/* Next */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    page + 1,
                    totalPages
                  )
                )
              }
              disabled={
                currentPage === totalPages
              }
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ›
            </button>

          </div>

        )}

      </div>


      {/* Record Payment Popup */}

      {showPaymentPopup && selectedStudent && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">

            {/* Header */}

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900">
                Record Payment
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the payment details below.
              </p>

            </div>


            {/* Form */}

            <div className="space-y-5">

              {/* Student Name */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Student Name
                </label>

                <input
                  type="text"
                  value={
                    selectedStudent.name || ""
                  }
                  disabled
                  className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 text-sm text-gray-700"
                />

              </div>


              {/* Student ID */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Student ID
                </label>

                <input
                  type="text"
                  value={
                    selectedStudent.idNumber || ""
                  }
                  disabled
                  className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 text-sm text-gray-700"
                />

              </div>


              {/* Month + Date */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Payment Month */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Payment Month
                  </label>

                  <select
                    value={
                      paymentData.paymentMonth
                    }
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paymentMonth:
                          e.target.value,
                      })
                    }
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >

                    {paymentMonths.map(
                      (month) => (

                        <option
                          key={month}
                          value={month}
                        >
                          {month}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* Payment Date */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Payment Date
                  </label>

                  <input
                    type="date"
                    value={
                      paymentData.paymentDate
                    }
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paymentDate:
                          e.target.value,
                      })
                    }
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                </div>

              </div>


              {/* Amount */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Amount (Rs)
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter amount"
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      amount: e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

              </div>

            </div>


            {/* Buttons */}

            <div className="mt-7 flex justify-end gap-3 border-t border-gray-200 pt-5">

              <button
                type="button"
                onClick={closePaymentPopup}
                className="rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmPayment}
                className="rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}


      {/* Payment Details Popup */}

      {showDetailsPopup && selectedPayment && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            {/* Header */}

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900">
                Payment Details
              </h2>

            </div>


            {/* Details */}

            <div className="space-y-0">

              {/* Invoice Number */}

              <div className="flex items-center border-b border-gray-200 py-4">

                <span className="w-1/2 text-sm font-semibold text-gray-800">
                  Invoice Number
                </span>

                <span className="w-1/2 text-sm text-gray-700">
                  {selectedPayment.invoiceNumber}
                </span>

              </div>


              {/* Student Name */}

              <div className="flex items-center border-b border-gray-200 py-4">

                <span className="w-1/2 text-sm font-semibold text-gray-800">
                  Student Name
                </span>

                <span className="w-1/2 text-sm text-gray-700">
                  {selectedPayment.studentName}
                </span>

              </div>


              {/* Student ID */}

              <div className="flex items-center border-b border-gray-200 py-4">

                <span className="w-1/2 text-sm font-semibold text-gray-800">
                  Student ID
                </span>

                <span className="w-1/2 text-sm text-gray-700">
                  {selectedPayment.idNumber}
                </span>

              </div>


              {/* Amount */}

              <div className="flex items-center border-b border-gray-200 py-4">

                <span className="w-1/2 text-sm font-semibold text-gray-800">
                  Amount
                </span>

                <span className="w-1/2 text-sm text-gray-700">
                  Rs.{" "}
                  {Number(
                    selectedPayment.amount
                  ).toLocaleString()}
                </span>

              </div>


              {/* Month */}

              <div className="flex items-center border-b border-gray-200 py-4">

                <span className="w-1/2 text-sm font-semibold text-gray-800">
                  Month
                </span>

                <span className="w-1/2 text-sm text-gray-700">
                  {selectedPayment.paymentMonth}
                </span>

              </div>


              {/* Payment Date */}

              <div className="flex items-center border-b border-gray-200 py-4">

                <span className="w-1/2 text-sm font-semibold text-gray-800">
                  Payment Date
                </span>

                <span className="w-1/2 text-sm text-gray-700">
                  {formatDate(
                    selectedPayment.paymentDate
                  )}
                </span>

              </div>


              {/* Status */}

              <div className="flex items-center py-4">

                <span className="w-1/2 text-sm font-semibold text-gray-800">
                  Status
                </span>

                <span className="w-1/2">

                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {selectedPayment.status}
                  </span>

                </span>

              </div>

            </div>


            {/* Close */}

            <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">

              <button
                type="button"
                onClick={closeDetailsPopup}
                className="rounded-lg bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}