import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ➕ ADD CONTRACT
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // ================= VALIDATION =================
    if (!body.company_id) {
      return NextResponse.json(
        { error: "company_id required" },
        { status: 400 }
      )
    }

    if (!body.employee_name) {
      return NextResponse.json(
        { error: "employee_name required" },
        { status: 400 }
      )
    }

    // ================= PAYLOAD CLEAN =================
    const payload = {
      company_id: body.company_id,

      company_name: body.company_name || null,
      contract_no: body.contract_no || null,
      address: body.address || null,

      employee_name: body.employee_name,
      staff_id: body.staff_id || null,
      register: body.register || null,
      email: body.email || null,
      phone: body.phone || null,

      position: body.position || null,
      duties: body.duties || null,

      salary: body.salary ? Number(body.salary) : 0,
      conditions: body.conditions || null,

      start_date: body.start_date || null,
      end_date: body.end_date || null,

      auto_extend: body.auto_extend || null,
      extra: body.extra || null,
    }

    // ================= INSERT =================
    const { data, error } = await supabase
      .from("contracts")
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error("❌ INSERT ERROR:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      data,
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    )
  }
}