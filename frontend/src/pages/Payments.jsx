import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Check, DollarSign, History, Search, Users, X} from 'lucide-react';

const PAYMENT_KEY = "paymentHistory";
export default function Payments(){

  const navigate = useNavigate();

  //lord student data
  const students = JSON.parse(
    localStorage.getItem("studentList") || "[]"
  )

  //get current month
  const getCurrentMonth = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  };

  // Get today's date
  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Get payment month
  const getPaymentMonths = () => {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 12 }, (_, index) => {
      return new Date(currentYear, index, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
    });
  };
  const paymentMonths = getPaymentMonths();

  // Load saved payments
  const [payments, setPayments] = useState(() => {
    const savedPayments = localStorage.getItem(PAYMENT_KEY);

    return savedPayments
      ? JSON.parse(savedPayments)
      : [];
  });

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentData, setPaymentData] = useState({
    studentId: "",
    paymentMonth: getCurrentMonth(),
    paymentDate: new Date().toISOString().split("T")[0],
    amount: ""
  });
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  //get selected student data
  const selectedStudent = students.find(
    (student) => student.id === paymentData.studentId
  );

  //open payment popup
  const openPaymentPopup = (student) => {

    setPaymentData({
      studentId: student.id,
      paymentMonth: getCurrentMonth(),
      paymentDate: new Date().toISOString().split("T")[0],
      amount: ""
    });

    setShowPaymentPopup(true);
  };

  //close payment popup
  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
  };

  // Open payment details popup
  const openDetailsPopup = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsPopup(true);
  };

  // Close payment details popup
  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedPayment(null);
  };

  //search students
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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

  // Check student has paid for a month
  const getStudentPayment = (studentId) => {
    return payments.find(
      (payment) =>
        payment.studentId === studentId &&
        payment.paymentMonth === getCurrentMonth()
    );
  };

  // Confirm payment
  const handleConfirmPayment = () => {

    // Validate amount
    if (
      !paymentData.amount ||
      Number(paymentData.amount) <= 0
    ) {
      alert("Please enter a valid payment amount.");
      return;
    }

    // Validate payment date
    if (!paymentData.paymentDate) {
      alert("Please select the payment date.");
      return;
    }

    // Check duplicate payment
    const alreadyPaid = payments.some(
      (payment) =>
        payment.studentId === paymentData.studentId &&
        payment.paymentMonth === paymentData.paymentMonth
    );

    if (alreadyPaid) {
      alert(
        `${selectedStudent?.name} has already paid for ${paymentData.paymentMonth}.`
      );
      return;
    }

    const existingPayments = JSON.parse(
      localStorage.getItem("paymentHistory") || "[]"
    );

    const currentYear = new Date().getFullYear();

    const invoiceNumber = `INV-${currentYear}-${String(existingPayments.length + 1).padStart(3, "0")}`;

    // Create new payment
    const newPayment = {
      id: Date.now(),

      invoiceNumber: invoiceNumber,

      studentId: paymentData.studentId,

      studentName: selectedStudent?.name || "Unknown Student",

      paymentMonth: paymentData.paymentMonth,

      paymentDate: paymentData.paymentDate,

      amount: Number(paymentData.amount),

      status: "Paid"
    };

    // Add new payment
    const updatedPayments = [
      ...payments,
      newPayment
    ];

    // Save to state
    setPayments(updatedPayments);

    // Save to localStorage
    localStorage.setItem(
      PAYMENT_KEY,
      JSON.stringify(updatedPayments)
    );

    // Close popup
    setShowPaymentPopup(false);

    // Reset form
    setPaymentData({
      studentId: "",
      paymentMonth: getCurrentMonth(),
      paymentDate: getToday(),
      amount: ""
    });
  };

  // Summary
  const currentMonth = getCurrentMonth();

  const currentMonthPayments = payments.filter(
    (payment) => payment.paymentMonth === currentMonth
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
    if (!date) return "-";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return(
    <div className="space-y-8">

      {/*Header title*/}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Payments</h1>

        <button
          onClick={() => navigate("/payment/history")}
          className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          <History size={18}/>
          History
        </button>
      </div>

      {/*Summary cards*/}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/*Total*/}
        <div className="rounded-2xl bg-blue-100 p-5">
          <div className="flex items-center gap-3">

            <Users size={22}
              className="text-blue-950"
            />

            <span className="text-sm font-semibold text-blue-950">Total</span>
          </div>

          <p className="mt-5 text-2xl font-bold text-blue-950">{students.length}</p>

          <p className="mt-2 text-xs font-medium text-blue-950">Students registered</p>

        </div>

        {/*Paid*/}
        <div className="rounded-2xl bg-green-100 p-5">
          <div className="flex items-center gap-3">

            <Check
              size={22}
              className="text-green-900"
            />

            <span className="text-sm font-semibold text-green-900">Paid</span>
          </div>

          <p className="mt-5 text-2xl font-bold text-green-900">
            {paidStudents}
          </p>

          <p className="mt-2 text-xs font-medium text-green-900">Payments received</p>
        </div>

        {/*Pending payments*/}
        <div className="rounded-2xl bg-red-100 p-5">
          <div className="flex items-center gap-3">

            <X
              size={22}
              className="text-red-900"
            />

            <span className="text-sm font-semibold text-red-900">Pending</span>
          </div>

          <p className="mt-5 text-2xl font-bold text-red-900">
            {pendingStudents}
          </p>

          <p className="mt-2 text-xs font-medium text-red-900">Awaiting payments</p>
        </div>

        {/*Total Collected*/}
        <div className="rounded-2xl bg-teal-100 p-5">
          <div className="flex items-center gap-3">

            <DollarSign
              size={22}
              className="text-teal-900"
            />

            <span className="text-sm font-semibold text-teal-900">Total Collected</span>
          </div>

          <p className="mt-5 text-2xl font-bold text-teal-900">
            Rs. {totalCollected.toLocaleString()}
          </p>

          <p className="mt-2 text-xs font-medium text-teal-900">Successfully received</p>
        </div>
      </div>

      {/*Payment details section*/}
      <div className="mt-8">
        <h2 className="mb-6 text-lg font-semibold text-black">Students payments for this month</h2>

        {/*Search bar*/}
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

        {/*Table*/}
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

              {filteredStudents.length > 0 ? (

                currentStudents.map((student) => {

                  const studentPayment =
                    getStudentPayment(student.id);

                  const isPaid = Boolean(studentPayment);

                  return (

                    <tr
                      key={student.id}
                      className="border-b border-gray-200"
                    >

                      {/* Student Name */}

                      <td className="px-3 py-4 text-gray-800">
                        {student.name}
                      </td>


                      {/* Student ID */}

                      <td className="px-3 py-4 text-gray-700">
                        {student.id}
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
                            onClick={()=> openDetailsPopup(studentPayment)}
                            className="w-18 rounded-lg border border-blue-600 px-5 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                          >
                            View
                          </button>

                        ) : (

                          <button
                            type="button"
                            onClick={() => openPaymentPopup(student)}
                            className="w-18 rounded-lg bg-blue-700 px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
                          >
                            Pay
                          </button>

                        )}

                      </td>

                    </tr>

                  );

                })

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="py-10 text-center text-sm text-gray-500"
                  >
                    No students found.
                  </td>

                </tr>

              )}

            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="mt-5 flex items-center justify-end gap-2">

              {/* Previous */}
              <button
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-500 transition hover:bg-gray-100"
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
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm ${
                    currentPage === page
                      ? "bg-[#4F46E5] font-bold text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>

              ))}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-500 transition hover:bg-gray-100"
              >
                ›
              </button>

            </div>
          )}
        </div>
      </div>

      {/*payment popup*/}
      {showPaymentPopup && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">


            {/* Popup Header */}

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
                  value={selectedStudent?.name || ""}
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
                  value={paymentData.studentId}
                  disabled
                  className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 text-sm text-gray-700"
                />

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Payment Month */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Payment Month
                  </label>

                  <select
                    value={paymentData.paymentMonth}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paymentMonth: e.target.value
                      })
                    }
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {paymentMonths.map((month)=>(
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>


                {/* Payment Date */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Payment Date
                  </label>

                  <input
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paymentDate: e.target.value
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
                      amount: e.target.value
                    })
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

              </div>

            </div>

            <div className="mt-7 flex justify-end gap-3 border-t border-gray-200 pt-5">

              {/* Cancel */}

              <button
                type="button"
                onClick={closePaymentPopup}
                className="rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-300"
              >
                Cancel
              </button>

              {/* Confirm */}

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

            {/* Popup Header */}
            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-900">
                Payment Details
              </h2>

            </div>


            {/* Payment Details */}
            <div className="space-y-0">

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
                  {selectedPayment.studentId}
                </span>

              </div>


              {/* Amount */}
              <div className="flex items-center border-b border-gray-200 py-4">

                <span className="w-1/2 text-sm font-semibold text-gray-800">
                  Amount
                </span>

                <span className="w-1/2 text-sm text-gray-700">
                  Rs. {selectedPayment.amount}
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
                  {selectedPayment.paymentDate}
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


            {/* Close Button */}
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
  )
}