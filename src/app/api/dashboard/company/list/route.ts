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

    // 🔥 mt_company-с бүх компаниуд авах
    const { data, error } = await supabase
      .from("mt_company")
      .select("id, name, company_mail")

    if (error) throw error

    return NextResponse.json({
      success: true,
      companies: data,
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}