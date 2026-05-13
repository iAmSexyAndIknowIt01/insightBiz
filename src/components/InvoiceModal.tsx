"use client"

import { useEffect, useState } from "react"

export default function InvoiceModal({
  open,
  onClose,
  onCreated,
}: any) {
  const [companies, setCompanies] = useState<any[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [items, setItems] = useState([
    { name: "", qty: 1, price: 0 },
  ])

  // 👉 fetch companies (mt_company)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companyId = sessionStorage.getItem("company_id")

        console.log("🔥 session company_id:", companyId)

        const res = await fetch("/api/dashboard/company/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: companyId,
          }),
        })

        const data = await res.json()

        console.log("🏢 companies:", data)

        if (!res.ok) throw new Error(data.error)

        setCompanies(data.companies || [])
      } catch (err) {
        console.error("❌ fetchCompanies error:", err)
      }
    }

    if (open) fetchCompanies()
  }, [open])

  // 👉 add item
  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0 }])
  }

  // 👉 total calc
  const total = items.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  )

  const handleSubmit = async () => {
    try {
      const companyId = sessionStorage.getItem("company_id")

      console.log("💾 CREATE INVOICE:", {
        companyId,
        selectedCompanyId,
        items,
      })

      const res = await fetch("/api/dashboard/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: companyId,             // 🔥 өөрийн company
          customer_id: selectedCompanyId,    // 🔥 сонгосон company
          items,
        }),
      })

      const data = await res.json()

      console.log("✅ invoice result:", data)

      if (!res.ok) throw new Error(data.error)

      onCreated()
      onClose()
    } catch (err) {
      console.error("❌ create invoice error:", err)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl space-y-4 shadow-xl">

        <h2 className="text-xl font-bold">Invoice үүсгэх</h2>

        {/* 🏢 COMPANY SELECT */}
        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="w-full border p-2 rounded-xl"
        >
          <option value="">Компани сонгох</option>

          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.company_mail})
            </option>
          ))}
        </select>

        {/* ITEMS */}
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">

              <input
                placeholder="Name"
                value={item.name}
                onChange={(e) => {
                  const newItems = [...items]
                  newItems[i].name = e.target.value
                  setItems(newItems)
                }}
                className="border p-2 rounded-xl"
              />

              <input
                type="number"
                value={item.qty}
                onChange={(e) => {
                  const newItems = [...items]
                  newItems[i].qty = Number(e.target.value)
                  setItems(newItems)
                }}
                className="border p-2 rounded-xl"
              />

              <input
                type="number"
                value={item.price}
                onChange={(e) => {
                  const newItems = [...items]
                  newItems[i].price = Number(e.target.value)
                  setItems(newItems)
                }}
                className="border p-2 rounded-xl"
              />

            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="text-indigo-600 text-sm hover:underline"
        >
          + Item нэмэх
        </button>

        {/* TOTAL */}
        <div className="text-right font-bold">
          Нийт: ₮{total.toLocaleString()}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Болих</button>

          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
          >
            Хадгалах
          </button>
        </div>

      </div>
    </div>
  )
}