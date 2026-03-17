import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, full_name } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    const supabaseAdmin = createServerSupabase()

    // Create the user via admin API and mark email as confirmed to avoid email sending
    const createRes = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    })

    // Log full response for easier debugging
    // eslint-disable-next-line no-console
    console.debug('admin.createUser response', createRes)

    // Support both shapes: { data, error } or { user, error }
    const maybeError = (createRes as any).error ?? (createRes as any).error
    const created = (createRes as any).data?.user ?? (createRes as any).data ?? (createRes as any).user

    if (maybeError) {
      // eslint-disable-next-line no-console
      console.error('admin.createUser error', maybeError)
      return NextResponse.json({ error: maybeError.message ?? String(maybeError), detail: maybeError }, { status: 500 })
    }

    if (!created || !created.id) {
      // eslint-disable-next-line no-console
      console.error('admin.createUser unexpected response', createRes)
      return NextResponse.json({ error: 'Failed to create user', detail: createRes }, { status: 500 })
    }

    // Upsert profile row using service role key
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: created.id, email, full_name, role: 'student' }, { onConflict: 'id' })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, user: { id: created.id, email: created.email } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
