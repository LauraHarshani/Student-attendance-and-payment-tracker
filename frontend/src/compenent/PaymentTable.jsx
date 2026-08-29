import React, { useEffect, useState } from "react";

const badgeStyles = {
  Cash: "bg-green-100 text-green-700",
  Paid: "bg-green-100 text-green-700",
  "Bank Transfer": "bg-blue-100 text-blue-700",
  Card: "bg-purple-100 text-purple-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Failed: "bg-red-100 text-red-700",
};

const PaymentTable = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Get payments
        const paymentsResponse = await fetch(
          "http://localhost:5000/api/payments",
          {
            headers,
          }
        );

        if (!paymentsResponse.ok) {
          throw new Error("Failed to fetch payments");
        }

        const paymentsData =
          await paymentsResponse.json();

        // Get students
        const studentsResponse = await fetch(
          "http://localhost:5000/api/students",
          {
            headers,
          }
        );

        if (!studentsResponse.ok) {
          throw new Error("Failed to fetch students");
        }

        const studentsData =
          await studentsResponse.json();

        setPayments(
          paymentsData.payments || []
        );

        setStudents(studentsData);

      } catch (error) {
        console.error(
          "Failed to load payment table:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // --------------------------------
  // Get student name
  // --------------------------------

  const getStudentName = (idNumber) => {
    const student = students.find(
      (student) =>
        student.idNumber === idNumber
    );

    return student
      ? student.name
      : "Unknown Student";
  };


  // --------------------------------
  // Format date
  // --------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

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
      month: "short",
      year: "numeric",
    });
  };


  // --------------------------------
  // Latest payments
  // --------------------------------

  const latestPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);


  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-gray-500">
          Loading payments...
        </p>
      </div>
    );
  }


  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">

      <table className="w-full border-collapse text-sm">

        <thead>

          <tr className="bg-gray-200 text-left">

            <th className="px-5 py-4 text-xs font-semibold text-gray-600">
              Invoice ID
            </th>

            <th className="px-5 py-4 text-xs font-semibold text-gray-600">
              Student Name
            </th>

            <th className="px-5 py-4 text-xs font-semibold text-gray-600">
              Date
            </th>

            <th className="px-5 py-4 text-xs font-semibold text-gray-600">
              Amount
            </th>

            <th className="px-5 py-4 text-xs font-semibold text-gray-600">
              Status
            </th>

            <th className="px-5 py-4 text-xs font-semibold text-gray-600">
              Action
            </th>

          </tr>

        </thead>


        <tbody>

          {latestPayments.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="px-5 py-8 text-center text-sm text-gray-500"
              >
                No payments found.
              </td>

            </tr>

          ) : (

            latestPayments.map((payment) => (

              <tr
                key={payment._id}
                className="border-b border-gray-100"
              >

                {/* Invoice */}

                <td className="px-5 py-4 text-gray-700">
                  {payment.invoiceNumber}
                </td>


                {/* Student */}

                <td className="px-5 py-4 text-gray-700">
                  {getStudentName(
                    payment.idNumber
                  )}
                </td>


                {/* Date */}

                <td className="px-5 py-4 text-gray-700">
                  {formatDate(
                    payment.paymentDate
                  )}
                </td>


                {/* Amount */}

                <td className="px-5 py-4 text-gray-700">
                  Rs.{" "}
                  {Number(
                    payment.amount || 0
                  ).toLocaleString()}
                </td>


                {/* Status */}

                <td className="px-5 py-4">

                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      badgeStyles[
                        payment.status
                      ] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {payment.status}
                  </span>

                </td>


                {/* Action */}

                <td className="px-5 py-4 text-gray-700">
                  ...
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
};

export default PaymentTable;