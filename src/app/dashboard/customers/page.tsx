"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Customer = {
  id: string
  first_name: string
  last_name: string
  email: string
  age: number
  created_at: string
}

export default function Customers() {
  const [search, setSearch] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchCustomers()
  }, [])

  const getToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return session?.access_token
  }

  const fetchCustomers = async () => {
    setLoading(true)

    const token = await getToken()

    const res = await fetch("/api/dashboard/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    setCustomers(data)
    setLoading(false)
  }

  // ➕ ADD
  const handleAdd = async () => {
    const token = await getToken()

    const res = await fetch("/api/dashboard/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      return
    }

    setOpen(false)
    setForm({ first_name: "", last_name: "", email: "", age: "" })
    fetchCustomers()
  }

  // 🗑 DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Устгах уу?")) return

    const token = await getToken()

    await fetch(`/api/dashboard/customers?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    fetchCustomers()
  }

  const filteredCustomers = customers.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      <div className="mb-6 flex gap-4">
        <input
          placeholder="Хэрэглэгч хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 rounded"
        >
          + Add
        </button>
      </div>

      <div className="bg-white/60 border rounded-xl p-6">

        {loading ? "Loading..." : (
          <table className="w-full">
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="border-b">
                  <td>{c.first_name} {c.last_name}</td>
                  <td>{c.email}</td>
                  <td>{c.age}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
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
          <div className="bg-white p-6 rounded w-full max-w-md">

            <h2 className="text-xl mb-4">Add Customer</h2>

            <input placeholder="First name" className="w-full border p-2 mb-2"
              value={form.first_name}
              onChange={(e)=>setForm({...form, first_name:e.target.value})}
            />

            <input placeholder="Last name" className="w-full border p-2 mb-2"
              value={form.last_name}
              onChange={(e)=>setForm({...form, last_name:e.target.value})}
            />

            <input placeholder="Email" className="w-full border p-2 mb-2"
              value={form.email}
              onChange={(e)=>setForm({...form, email:e.target.value})}
            />

            <input placeholder="Age" className="w-full border p-2 mb-4"
              value={form.age}
              onChange={(e)=>setForm({...form, age:e.target.value})}
            />

            <div className="flex gap-2">
              <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded">
                Save
              </button>

              <button onClick={()=>setOpen(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}