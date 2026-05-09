import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 📥 GET (with default current month filter)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const userId = searchParams.get("user_id")
    const type = searchParams.get("type")
    const search = searchParams.get("search")
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const min = searchParams.get("min")
    const max = searchParams.get("max")

    if (!userId) {
      return NextResponse.json({ error: "user_id required" }, { status: 400 })
    }

    // ✅ default current month
    const now = new Date()

    const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1)
    const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)

    // ✅ DATE FILTER (fallback → current month)
    query = query
      .gte("transaction_date", from || defaultFrom.toISOString())
      .lte("transaction_date", to || defaultTo.toISOString())

    // ✅ OTHER FILTERS
    if (type) {
      query = query.eq("type", type)
    }

    if (search) {
      query = query.ilike("note", `%${search}%`)
    }

    if (min) {
      query = query.gte("amount", Number(min))
    }

    if (max) {
      query = query.lte("amount", Number(max))
    }

    const { data, error } = await query.order("transaction_date", {
      ascending: false,
    })

    if (error) throw error

    return NextResponse.json(data)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// ➕ ADD
export async function POST(req: Request) {
  const body = await req.json()

  const { data, error } = await supabase
    .from("transactions")
    .insert([body])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}

// ✏️ EDIT
export async function PUT(req: Request) {
  const body = await req.json()

  const { id, ...rest } = body

  const { data, error } = await supabase
    .from("transactions")
    .update(rest)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}

// 🗑 DELETE
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}