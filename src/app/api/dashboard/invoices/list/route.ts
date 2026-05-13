import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { company_id } = await req.json()

    if (!company_id) {
      return NextResponse.json(
        { error: "company_id required" },
        { status: 400 }
      )
    }

    // 🔥 invoices + items + company JOIN
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        id,
        total,
        status,
        created_at,
        customer:mt_company (
          id,
          name,
          company_mail
        ),
        items:invoice_items (
          id,
          name,
          qty,
          price
        )
      `)
      .eq("company_id", company_id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      invoices: data,
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}