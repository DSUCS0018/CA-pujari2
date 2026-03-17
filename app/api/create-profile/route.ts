import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, full_name } = body
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const supabaseAdmin = createServerSupabase()

    // Lookup the auth user by email using the admin API
    const userResult = await supabaseAdmin.auth.admin.getUserByEmail(email)
    // userResult.data?.user may contain the user object depending on SDK
    const user = (userResult as any).data?.user ?? (userResult as any).data

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Auth user not found yet' }, { status: 404 })
    }

    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: user.id, email, full_name, role: 'student' }, { onConflict: 'id' })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
