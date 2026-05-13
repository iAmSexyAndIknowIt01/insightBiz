import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { company_id, customer_id, items } = await req.json()

    if (!company_id || !customer_id || !items?.length) {
      return NextResponse.json({ error: "missing data" }, { status: 400 })
    }

    // 🔥 total calculate
    const total = items.reduce(
      (sum: number, i: any) => sum + i.qty * i.price,
      0
    )

    // 👉 invoice insert
    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        company_id,
        customer_id,
        total,
      })
      .select()
      .single()

    if (error) throw error

    // 👉 items insert
    const itemsPayload = items.map((i: any) => ({
      invoice_id: invoice.id,
      name: i.name,
      qty: i.qty,
      price: i.price,
      total: i.qty * i.price,
    }))

    await supabase.from("invoice_items").insert(itemsPayload)

    return NextResponse.json({ success: true, invoice })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}