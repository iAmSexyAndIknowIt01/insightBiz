"use client"

import { useEffect, useState } from "react"
import InvoiceModal from "@/components/InvoiceModal"
import React from "react"

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  // 🔥 fetch invoices
  const fetchInvoices = async () => {
    try {
      const companyId = sessionStorage.getItem("company_id")

      const res = await fetch("/api/dashboard/invoices/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: companyId,
        }),
      })

      const data = await res.json()

      console.log("📄 invoices:", data)

      if (!res.ok) throw new Error(data.error)

      setInvoices(data.invoices || [])
    } catch (err) {
      console.error("❌ fetch invoices error:", err)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          + Invoice нэмэх
        </button>
      </div>

      {/* TABLE */}
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
              <React.Fragment key={inv.id}>

                <tr
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setExpanded(expanded === inv.id ? null : inv.id)
                  }
                >
                  <td className="p-3 font-medium">{inv.id}</td>

                  <td className="p-3">
                    {inv.customer?.name || "-"}
                  </td>

                  <td className="p-3">
                    ₮{Number(inv.total).toLocaleString("mn-MN")}
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

                  <td className="p-3">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                </tr>

                {/* 🔥 EXPAND ITEMS */}
                {expanded === inv.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="p-4">

                      <div className="space-y-2">
                        {inv.items?.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.name} × {item.qty}
                            </span>

                            <span>
                              ₮{(item.qty * item.price).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}
          </tbody>
        </table>

      </div>

      {/* MODAL */}
      <InvoiceModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={fetchInvoices}
      />
    </div>
  )
}