import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)

    // 👉 FILTERS
    if (type) {
      query = query.eq("type", type)
    }

    if (search) {
      query = query.ilike("note", `%${search}%`)
    }

    if (from) {
      query = query.gte("transaction_date", from)
    }

    if (to) {
      query = query.lte("transaction_date", to)
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
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}