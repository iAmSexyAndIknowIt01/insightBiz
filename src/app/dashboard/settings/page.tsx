"use client"

import { useEffect, useState } from "react"

export default function Settings() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // 👉 fetch
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyId = sessionStorage.getItem("company_id")

        if (!companyId) {
          setError("company_id байхгүй байна")
          return
        }

        const res = await fetch("/api/dashboard/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_id: companyId }),
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.error)

        setCompany(data.company)
        setName(data.company.name || "")
        setEmail(data.company.company_mail || "")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [])

  // 👉 save
  const handleSave = async () => {
    try {
      setSaving(true)

      const companyId = sessionStorage.getItem("company_id")

      const res = await fetch("/api/dashboard/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          name,
          company_mail: email,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setCompany({
        ...company,
        name,
        company_mail: email,
      })

      setEditing(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  // 👉 cancel edit
  const handleCancel = () => {
    setEditing(false)
    setName(company.name || "")
    setEmail(company.company_mail || "")
  }

  if (loading) return <div className="p-6">Уншиж байна...</div>

  if (error)
    return <div className="p-6 text-red-500">❌ {error}</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white border rounded-2xl p-6 shadow space-y-6">

        {/* ========= Editable ========= */}
        <div className="grid md:grid-cols-2 gap-4">

          <Input
            label="Бизнесийн нэр"
            value={name}
            onChange={setName}
            disabled={!editing}
          />

          <Input
            label="Имэйл"
            value={email}
            onChange={setEmail}
            disabled={!editing}
          />

        </div>

        {/* ========= Readonly ========= */}
        <div className="grid md:grid-cols-2 gap-4">

          <Input label="Company Code" value={company.company_code} disabled />

          <Input label="Owner ID" value={company.owner_id} disabled />

          <Input
            label="Created"
            value={new Date(company.created_at).toLocaleString()}
            disabled
          />

          <Input
            label="Updated"
            value={new Date(company.updated_at).toLocaleString()}
            disabled
          />

        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm text-gray-500">Тайлбар</label>
          <textarea
            value={company.description || ""}
            disabled
            className="w-full mt-1 px-4 py-2 border rounded-xl bg-gray-100"
          />
        </div>

        {/* ========= ACTIONS ========= */}
        <div className="flex gap-3 pt-4">

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl"
            >
              ✏️ Засах
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded-xl disabled:opacity-50"
              >
                {saving ? "Хадгалж байна..." : "💾 Хадгалах"}
              </button>

              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white px-6 py-2 rounded-xl"
              >
                Болих
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  )
}

// ✅ reusable input component
function Input({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2 mt-1 border rounded-xl ${
          disabled ? "bg-gray-100 text-gray-500" : ""
        }`}
      />
    </div>
  )
}