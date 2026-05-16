"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Transactions() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [userId, setUserId] = useState("")

  // filters
  const [type, setType] = useState("")
  const [search, setSearch] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")

  // pagination
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)

  // modal
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [form, setForm] = useState({
    amount: "",
    type: "income",
    note: "",
    transaction_date: "",
  })

  const totalPages = Math.ceil(total / limit)

  const getCurrentMonthRange = () => {
    const now = new Date()

    const start = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0]

    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0]

    return { start, end }
  }

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        setUserId(data.user.id)

        const { start, end } = getCurrentMonthRange()
        setFrom(start)
        setTo(end)

        // eslint-disable-next-line react-hooks/immutability
        fetchData(data.user.id, 1, start, end)
      }
    }

    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async (
    uid?: string,
    customPage?: number,
    customFrom?: string,
    customTo?: string
  ) => {
    const id = uid || userId
    if (!id) return

    setLoading(true)

    const params = new URLSearchParams({
      user_id: id,
      page: String(customPage || page),
      limit: String(limit),
      ...(type && { type }),
      ...(search && { search }),
      ...(customFrom || from ? { from: customFrom || from } : {}),
      ...(customTo || to ? { to: customTo || to } : {}),
      ...(min && { min }),
      ...(max && { max }),
    })

    const res = await fetch(`/api/dashboard/transactions?${params}`)
    const result = await res.json()

    setTransactions(result.data || [])
    setTotal(result.total || 0)
    setLoading(false)
  }

  // 🔍 SEARCH
  const handleSearch = () => {
    setPage(1)
    fetchData(userId, 1)
  }

  // 🔄 RESET
  const handleReset = () => {
    const { start, end } = getCurrentMonthRange()

    setType("")
    setSearch("")
    setMin("")
    setMax("")
    setFrom(start)
    setTo(end)
    setPage(1)

    fetchData(userId, 1, start, end)
  }

  // ➕ ADD / EDIT
  const handleSubmit = async () => {
    const payload = {
      ...form,
      amount: Number(form.amount),
      user_id: userId,
    }

    if (editId) {
      await fetch("/api/dashboard/transactions", {
        method: "PUT",
        body: JSON.stringify({ id: editId, ...payload }),
      })
    } else {
      await fetch("/api/dashboard/transactions", {
        method: "POST",
        body: JSON.stringify(payload),
      })
    }

    setOpen(false)
    setEditId(null)

    setForm({
      amount: "",
      type: "income",
      note: "",
      transaction_date: "",
    })

    fetchData()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (t: any) => {
    setEditId(t.id)
    setForm({
      amount: t.amount,
      type: t.type,
      note: t.note,
      transaction_date: t.transaction_date,
    })
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Устгах уу?")) return

    await fetch(`/api/dashboard/transactions?id=${id}`, {
      method: "DELETE",
    })

    fetchData()
  }

  // 👉 PAGE CHANGE
  const goToPage = (p: number) => {
    setPage(p)
    fetchData(userId, p)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      {/* FILTER */}
      <div className="bg-white/60 border p-4 rounded-xl mb-6">

        <div className="grid md:grid-cols-6 gap-2">

          <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
            <option value="">All</option>
            <option value="income">Орлого</option>
            <option value="expense">Зарлага</option>
          </select>

          <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded" />

          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border p-2 rounded" />

          <input placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} className="border p-2 rounded" />
          <input placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} className="border p-2 rounded" />

        </div>

        <div className="flex gap-2 mt-3">
          <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Хайх
          </button>

          <button onClick={handleReset} className="border px-4 py-2 rounded">
            Reset
          </button>

          <button onClick={() => setOpen(true)} className="ml-auto bg-green-600 text-white px-4 py-2 rounded">
            + Add
          </button>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white/60 p-4 rounded-xl">

        {loading ? "Loading..." : (
          <>
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th>Огноо</th>
                  <th>Төрөл</th>
                  <th>Дүн</th>
                  <th>Note</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b">
                    <td>{new Date(t.transaction_date).toLocaleDateString()}</td>
                    <td>{t.type}</td>
                    <td>₮{t.amount.toLocaleString()}</td>
                    <td>{t.note}</td>
                    <td className="flex gap-2">
                      <button onClick={() => handleEdit(t)} className="text-blue-500">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-500">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-4">

              <button
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                className="border px-3 py-1 rounded"
              >
                Prev
              </button>

              <span className="text-sm">
                {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
                className="border px-3 py-1 rounded"
              >
                Next
              </button>

            </div>
          </>
        )}

      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit" : "Add"} Transaction
            </h2>

            <input
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full border p-2 mb-3 rounded"
            />

            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border p-2 mb-3 rounded"
            >
              <option value="income">Орлого</option>
              <option value="expense">Зарлага</option>
            </select>

            <input
              placeholder="Note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="date"
              value={form.transaction_date}
              onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
              className="w-full border p-2 mb-3 rounded"
            />

            <div className="flex gap-2">
              <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded">
                Save
              </button>

              <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}