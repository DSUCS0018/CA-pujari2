import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // Fetch all bookings for this user
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (bookingsError) {
      console.error('Error fetching student bookings:', bookingsError)
      return NextResponse.json({ error: bookingsError.message }, { status: 500 })
    }

    // Enrich webinar bookings with live webinar data (title, platform, seats, starts_at)
    const webinarBookings = (bookings ?? []).filter(b => b.service_type === 'Webinar')
    const nseBookings = (bookings ?? []).filter(b => b.service_type === 'NSE')
    const courseBookings = (bookings ?? []).filter(b => b.service_type === 'Course')

    // Fetch master webinar records to enrich with platform / starts_at info
    let webinarsMap: Record<string, any> = {}
    if (webinarBookings.length > 0) {
      const { data: webinars } = await supabase
        .from('webinars')
        .select('id, title, starts_at, duration_minutes, platform, description')
      if (webinars) {
        webinars.forEach(w => { webinarsMap[w.title?.toLowerCase()] = w })
      }
    }

    // Enrich webinar bookings with master data
    const enrichedWebinars = webinarBookings.map(b => {
      const master = webinarsMap[b.tier_name?.toLowerCase()] || {}
      return {
        ...b,
        // Prefer stored meeting_details, fallback to master webinar record
        starts_at: b.meeting_details?.scheduled_date
          ? `${b.meeting_details.scheduled_date}T${b.meeting_details.scheduled_time || '00:00'}:00`
          : master.starts_at || null,
        duration_minutes: master.duration_minutes || null,
        platform: master.platform || 'Zoom',
        description: master.description || '',
      }
    })

    // Fetch master NSE program data
    let nseMap: Record<string, any> = {}
    if (nseBookings.length > 0) {
      const { data: nsePrograms } = await supabase
        .from('nse_programs')
        .select('id, title, description, duration, sessions, category, badge_label')
      if (nsePrograms) {
        nsePrograms.forEach(n => { nseMap[n.title?.toLowerCase()] = n })
      }
    }

    const enrichedNSE = nseBookings.map(b => {
      const master = nseMap[b.tier_name?.toLowerCase()] || {}
      return { ...b, ...master, id: b.id, booking_id: b.id }
    })

    // Fetch master course data
    let courseMap: Record<string, any> = {}
    if (courseBookings.length > 0) {
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, description, duration, level, modules')
      if (courses) {
        courses.forEach(c => { courseMap[c.title?.toLowerCase()] = c })
      }
    }

    const enrichedCourses = courseBookings.map(b => {
      const master = courseMap[b.tier_name?.toLowerCase()] || {}
      return { ...b, ...master, id: b.id, booking_id: b.id }
    })

    // Final categorization: Some "Courses" might be NSE courses
    // We'll move any course that contains 'NSE' in its tier_name to the nse array
    const nseFinal = [...enrichedNSE, ...enrichedCourses.filter(c => c.tier_name?.toUpperCase().includes('NSE'))]
    const coursesFinal = enrichedCourses.filter(c => !c.tier_name?.toUpperCase().includes('NSE'))

    return NextResponse.json({
      webinars: enrichedWebinars,
      nse: nseFinal,
      courses: coursesFinal,
      total: (bookings ?? []).length,
    })
  } catch (err: any) {
    console.error('My Dashboard API Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
