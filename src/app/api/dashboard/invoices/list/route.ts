import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const {
      company_id,
      status,
      search,
      from,
      to,
      min,
      max,
    } = await req.json()

    if (!company_id) {
      return NextResponse.json(
        { error: "company_id required" },
        { status: 400 }
      )
    }

    // =========================
    // 🔥 ISSUED
    // =========================
    let issuedQuery = supabase
      .from("invoices")
      .select(`
        id,
        total,
        status,
        created_at,
        customer:mt_company (id, name),
        items:invoice_items (id, name, qty, price)
      `)
      .eq("company_id", company_id)

    // =========================
    // 🔥 PAYABLE
    // =========================
    let payableQuery = supabase
      .from("invoices")
      .select(`
        id,
        total,
        status,
        created_at,
        company:mt_company (id, name),
        items:invoice_items (id, name, qty, price)
      `)
      .eq("customer_id", company_id)

    // 👉 COMMON FILTER FUNCTION
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applyFilters = (query: any) => {
      if (status) query = query.eq("status", status)
      if (from) query = query.gte("created_at", from)
      if (to) query = query.lte("created_at", to)
      if (min) query = query.gte("total", Number(min))
      if (max) query = query.lte("total", Number(max))

      return query
    }

    issuedQuery = applyFilters(issuedQuery)
    payableQuery = applyFilters(payableQuery)

    const { data: issued, error: err1 } = await issuedQuery
    if (err1) throw err1

    const { data: payable, error: err2 } = await payableQuery
    if (err2) throw err2

    // 👉 search filter (frontend join field тул JS дээр шүүнэ)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterSearch = (arr: any[], key: string) => {
      if (!search) return arr

      return arr.filter((i) =>
        i[key]?.name?.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      issued: filterSearch(issued || [], "customer"),
      payable: filterSearch(payable || [], "company"),
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}