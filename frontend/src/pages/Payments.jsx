import React, { useState } from "react";
import {Check, DollarSign, History, Search, Users, X} from 'lucide-react';

export default function Payments(){

  return(
    <div className="space-y-8">

      {/*Header title*/}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Payments</h1>

        <button className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
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

          <p>{/*Total Students*/}</p>

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

          <p>{/*PaidStudents*/}</p>

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

          <p>{/*pendingPayments*/}</p>

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

          <p>{/*TotalCollected*/}</p>

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

            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}