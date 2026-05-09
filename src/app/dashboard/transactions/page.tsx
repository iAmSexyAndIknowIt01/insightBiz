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

  // modal
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [form, setForm] = useState({
    amount: "",
    type: "income",
    note: "",
    transaction_date: "",
  })

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setUserId(data.user.id)
        // eslint-disable-next-line react-hooks/immutability
        fetchData(data.user.id)
      }
    }

    init()
  }, [])

  const fetchData = async (uid?: string) => {
    const id = uid || userId
    if (!id) return

    setLoading(true)

    const params = new URLSearchParams({
      user_id: id,
      ...(type && { type }),
      ...(search && { search }),
      ...(from && { from }),
      ...(to && { to }),
      ...(min && { min }),
      ...(max && { max }),
    })

    const res = await fetch(`/api/dashboard/transactions?${params}`)
    const data = await res.json()

    setTransactions(data)
    setLoading(false)
  }

  // ➕ ADD / EDIT SUBMIT
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

  // ✏️ EDIT
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

  // 🗑 DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Устгах уу?")) return

    await fetch(`/api/dashboard/transactions?id=${id}`, {
      method: "DELETE",
    })

    fetchData()
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
          <button onClick={() => fetchData()} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Хайх
          </button>

          <button
            onClick={() => {
              setType("")
              setSearch("")
              setFrom("")
              setTo("")
              setMin("")
              setMax("")
              fetchData()
            }}
            className="border px-4 py-2 rounded"
          >
            Reset
          </button>

          <button
            onClick={() => setOpen(true)}
            className="ml-auto bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add
          </button>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white/60 p-4 rounded-xl">

        {loading ? "Loading..." : (
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

                  <td>₮{t.amount}</td>

                  <td>{t.note}</td>

                  <td className="flex gap-2">
                    <button onClick={() => handleEdit(t)} className="text-blue-500">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-500">Delete</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
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