"use client"

import { useState } from "react"

export default function ContractPage() {
  const [form, setForm] = useState({
    company_name: "Ажил олгогч ХХК",

    employee_name: "",
    staff_id: "",
    register: "",
    email: "",
    phone: "",

    address: "",
    contract_no: "",

    position: "",
    duties: "",

    salary: "",
    conditions: "",

    start_date: "",
    end_date: "",

    auto_extend: "",
    extra: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
  }

  // 🔥 SAVE
  const handleSave = async () => {
    try {
      setLoading(true)

      const companyId = sessionStorage.getItem("company_id")

      const res = await fetch("/api/dashboard/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          salary: Number(form.salary),
          company_id: companyId,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      alert("✅ Гэрээ амжилттай хадгалагдлаа")

    } catch (err) {
      console.error(err)
      alert("❌ Алдаа гарлаа")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-6">

      {/* ================= LEFT ================= */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">

        <h2 className="text-xl font-bold">Гэрээний мэдээлэл</h2>

        {/* COMPANY */}
        <input
          placeholder="Компанийн нэр"
          value={form.company_name}
          onChange={(e)=>handleChange("company_name", e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* EMPLOYEE */}
        <input
          placeholder="Ажилтны нэр"
          value={form.employee_name}
          onChange={(e)=>handleChange("employee_name", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Staff ID"
          value={form.staff_id}
          onChange={(e)=>handleChange("staff_id", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Регистр / РД"
          value={form.register}
          onChange={(e)=>handleChange("register", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e)=>handleChange("email", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Утасны дугаар"
          value={form.phone}
          onChange={(e)=>handleChange("phone", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Хаяг"
          value={form.address}
          onChange={(e)=>handleChange("address", e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* JOB */}
        <input
          placeholder="Албан тушаал"
          value={form.position}
          onChange={(e)=>handleChange("position", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Ажлын үүрэг"
          value={form.duties}
          onChange={(e)=>handleChange("duties", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Цалин"
          value={form.salary}
          onChange={(e)=>handleChange("salary", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Ажиллах нөхцөл"
          value={form.conditions}
          onChange={(e)=>handleChange("conditions", e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* DATE */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={form.start_date}
            onChange={(e)=>handleChange("start_date", e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={form.end_date}
            onChange={(e)=>handleChange("end_date", e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <textarea
          placeholder="Нэмэлт нөхцөл"
          value={form.extra}
          onChange={(e)=>handleChange("extra", e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl mt-4"
        >
          {loading ? "Хадгалж байна..." : "💾 Хадгалах"}
        </button>

      </div>

      {/* ================= RIGHT PREVIEW ================= */}
      <div className="bg-white border rounded-2xl p-8 text-sm leading-7">

        <p className="text-right text-xs">
          “{form.company_name}”-ийн тушаал
        </p>

        <h2 className="text-center font-bold text-lg mt-4">
          ХӨДӨЛМӨРИЙН ГЭРЭЭ
        </h2>

        <p className="mt-4">
          Ажил олгогч: <b>{form.company_name}</b>
          <br />
          Ажилтан: <b>{form.employee_name || "........"}</b>
          <br />
          Staff ID: {form.staff_id || "........"}
          <br />
          РД: {form.register || "........"}
          <br />
          Email: {form.email || "........"}
          <br />
          Утас: {form.phone || "........"}
        </p>

        {/* SECTION 1 */}
        <p className="text-center font-semibold mt-4">
          Нэг. Гэрээний зорилго
        </p>
        <p>1.1 Хөдөлмөрийн харилцааг зохицуулахад оршино.</p>

        {/* SECTION 2 */}
        <p className="text-center font-semibold mt-4">
          Хоёр. Үндсэн нөхцөл
        </p>
        <p>Албан тушаал: {form.position}</p>
        <p>Үүрэг: {form.duties}</p>
        <p>Цалин: ₮{Number(form.salary || 0).toLocaleString()}</p>
        <p>Нөхцөл: {form.conditions}</p>

        {/* SECTION 3 */}
        <p className="text-center font-semibold mt-4">
          Гурав. Хугацаа
        </p>
        <p>{form.start_date} - {form.end_date}</p>

        {/* SECTION 4 */}
        <p className="text-center font-semibold mt-4">
          Дөрөв. Нэмэлт нөхцөл
        </p>
        <p>{form.extra}</p>

        {/* SIGN */}
        <div className="flex justify-between mt-10">
          <div>
            <p>Ажил олгогч</p>
            <div className="border-t w-40 mt-6"></div>
          </div>

          <div>
            <p>Ажилтан</p>
            <div className="border-t w-40 mt-6"></div>
          </div>
        </div>

      </div>
    </div>
  )
}