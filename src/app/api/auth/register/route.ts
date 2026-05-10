import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 🔥 5 digit unique code
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
    const body = await req.json()

    const {
      email,
      password,
      mode,
      company_name,
      company_code,
    } = body

    // =========================
    // 🔐 CREATE AUTH USER
    // =========================
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (authError) throw new Error(authError.message)

    userId = authData.user.id

    // =========================
    // 👤 USER MODE
    // =========================
    if (mode === "user") {
      if (!company_code) {
        throw new Error("Company code required")
      }

      // 👉 company lookup
      const { data: company, error: companyError } = await supabase
        .from("mt_company")
        .select("id")
        .eq("company_code", company_code)
        .maybeSingle()

      if (companyError) throw companyError
      if (!company) throw new Error("Company code буруу байна")

      console.log("✅ company.id:", company.id)

      // 🔥 UPSERT ашиглаж байна
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            email,
            company_id: company.id,
          },
          { onConflict: "id" } // 👈 KEY FIX
        )

      if (profileError) throw profileError

      return NextResponse.json({ success: true })
    }

    // =========================
    // 🏢 COMPANY MODE
    // =========================
    if (mode === "company") {
      if (!company_name) {
        throw new Error("Company name required")
      }

      const code = await generateCompanyCode()

      const { error } = await supabase.from("mt_company").insert([
        {
          name: company_name,
          owner_id: userId,
          company_mail: email,
          company_code: code,
        },
      ])

      if (error) throw error

      return NextResponse.json({
        success: true,
        company_code: code,
      })
    }

    throw new Error("Invalid mode")

  } catch (err: unknown) {
    // 🔥 rollback auth user
    if (userId) {
      await supabase.auth.admin.deleteUser(userId)
    }

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}