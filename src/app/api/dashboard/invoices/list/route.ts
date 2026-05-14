import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { company_id } = await req.json()

    if (!company_id) {
      return NextResponse.json(
        { error: "company_id required" },
        { status: 400 }
      )
    }

    // 👉 1. Манай үүсгэсэн invoice
    const { data: issued, error: err1 } = await supabase
      .from("invoices")
      .select(`
        id,
        total,
        status,
        created_at,
        company_id,
        customer_id,
        customer:mt_company (
          id,
          name
        ),
        items:invoice_items (
          id,
          name,
          qty,
          price
        )
      `)
      .eq("company_id", company_id)

    if (err1) throw err1

    // 👉 2. Манай төлөх invoice
    const { data: payable, error: err2 } = await supabase
      .from("invoices")
      .select(`
        id,
        total,
        status,
        created_at,
        company_id,
        customer_id,
        company:mt_company (
          id,
          name
        ),
        items:invoice_items (
          id,
          name,
          qty,
          price
        )
      `)
      .eq("customer_id", company_id)

    if (err2) throw err2

    return NextResponse.json({
      issued: issued || [],
      payable: payable || [],
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}