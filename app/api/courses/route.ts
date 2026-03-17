import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const supabaseAdmin = createServerSupabase()
    const { data, error } = await supabaseAdmin.from('courses').select('*').order('created_at', { ascending: false })
    if (error) {
      // eslint-disable-next-line no-console
      console.error('API /api/courses error', error)
      return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 })
    }
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 })
  }
}
