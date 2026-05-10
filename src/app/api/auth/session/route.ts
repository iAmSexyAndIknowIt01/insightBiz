import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const user_id = body?.user_id

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id required" },
        { status: 400 }
      )
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("company_id, email")
      .eq("id", user_id)
      .single()

    if (error) throw error

    if (!profile) {
      return NextResponse.json(
        { error: "Profile олдсонгүй" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user_id,
      company_id: profile.company_id,
      email: profile.email,
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}