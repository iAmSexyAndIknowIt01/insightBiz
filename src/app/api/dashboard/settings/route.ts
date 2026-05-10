import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 📥 GET (company авах)
export async function POST(req: Request) {
  try {
    const { company_id } = await req.json()

    if (!company_id) {
      return NextResponse.json({ error: "company_id required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("mt_company")
      .select("*")
      .eq("id", company_id)
      .single()

    if (error) throw error

    return NextResponse.json({ company: data })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ✏️ UPDATE (зөвхөн name + email)
export async function PUT(req: Request) {
  try {
    const { company_id, name, company_mail } = await req.json()

    if (!company_id) {
      return NextResponse.json({ error: "company_id required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("mt_company")
      .update({
        name,
        company_mail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", company_id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}