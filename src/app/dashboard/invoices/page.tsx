"use client"

import { useEffect, useState } from "react"

type Invoice = {
  id: string
  customer: string
  amount: number
  status: "paid" | "pending"
  created_at: string
}

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    // 🔥 dummy data (дараа нь API-р солино)
    setInvoices([
      {
        id: "INV-001",
        customer: "Bat LLC",
        amount: 250000,
        status: "paid",
        created_at: "2026-01-01",
      },
      {
        id: "INV-002",
        customer: "Nomad Tech",
        amount: 180000,
        status: "pending",
        created_at: "2026-01-05",
      },
    ])
  }, [])

  return (
    <div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl">
          + Invoice нэмэх
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur border rounded-2xl shadow overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{inv.id}</td>
                <td className="p-3">{inv.customer}</td>
                <td className="p-3">
                  ₮{inv.amount.toLocaleString("mn-MN")}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      inv.status === "paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="p-3">{inv.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  )
}