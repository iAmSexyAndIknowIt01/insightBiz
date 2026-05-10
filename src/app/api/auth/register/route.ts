import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const generateCompanyCode = async (): Promise<string> => {
  while (true) {
    const code = Math.floor(10000 + Math.random() * 90000).toString()

    const { data } = await supabase
      .from("mt_company")
      .select("id")
      .eq("company_code", code)
      .maybeSingle()

    if (!data) return code
  }
}

export async function POST(req: Request) {
  let userId: string | null = null

  try {
    const { email, password, mode, company_name, company_code } =
      await req.json()

    // 🔐 CREATE USER
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) throw error
    userId = data.user.id

    // =====================
    // 👤 USER
    // =====================
    if (mode === "user") {
      const { data: company } = await supabase
        .from("mt_company")
        .select("id")
        .eq("company_code", company_code)
        .maybeSingle()

      if (!company) throw new Error("Company code буруу")

      await supabase.from("profiles").upsert({
        id: userId,
        email,
        company_id: company.id,
      })

      return NextResponse.json({ success: true })
    }

    // =====================
    // 🏢 COMPANY
    // =====================
    if (mode === "company") {
      const code = await generateCompanyCode()

      const { data: company } = await supabase
        .from("mt_company")
        .insert({
          name: company_name,
          owner_id: userId,
          company_mail: email,
          company_code: code,
        })
        .select()
        .single()

      // 🔥 owner profile үүсгэнэ
      await supabase.from("profiles").upsert({
        id: userId,
        email,
        company_id: company.id,
      })

      return NextResponse.json({
        success: true,
        company_code: code,
      })
    }

    throw new Error("Invalid mode")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (userId) {
      await supabase.auth.admin.deleteUser(userId)
    }

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}