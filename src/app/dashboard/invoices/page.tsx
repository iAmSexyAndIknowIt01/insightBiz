"use client"

import { useEffect, useState } from "react"
import InvoiceModal from "@/components/InvoiceModal"
import React from "react"

export default function InvoicePage() {
  const [issued, setIssued] = useState<any[]>([])
  const [payable, setPayable] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [tab, setTab] = useState<"issued" | "payable">("issued")

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

      if (!res.ok) throw new Error(data.error)

      setIssued(data.issued || [])
      setPayable(data.payable || [])

    } catch (err) {
      console.error("❌ fetch invoices error:", err)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const list = tab === "issued" ? issued : payable

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          + Invoice нэмэх
        </button>
      </div>

      {/* 🔥 SWITCH */}
      <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("issued")}
          className={`px-4 py-2 rounded-xl text-sm transition ${
            tab === "issued"
              ? "bg-white shadow font-semibold"
              : "text-gray-500"
          }`}
        >
          Нэхэмжлэл
        </button>

        <button
          onClick={() => setTab("payable")}
          className={`px-4 py-2 rounded-xl text-sm transition ${
            tab === "payable"
              ? "bg-white shadow font-semibold"
              : "text-gray-500"
          }`}
        >
          Манай төлөх
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white/70 backdrop-blur border rounded-2xl shadow overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">
                {tab === "issued" ? "Customer" : "From"}
              </th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {list.map((inv) => (
              <React.Fragment key={inv.id}>

                <tr
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setExpanded(expanded === inv.id ? null : inv.id)
                  }
                >
                  <td className="p-3 font-medium">{inv.id}</td>

                  <td className="p-3">
                    {tab === "issued"
                      ? inv.customer?.name
                      : inv.company?.name}
                  </td>

                  <td className="p-3">
                    ₮{Number(inv.total).toLocaleString()}
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

      <InvoiceModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={fetchInvoices}
      />
    </div>
  )
}