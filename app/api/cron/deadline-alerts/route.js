export const dynamic = 'force-dynamic'

export async function GET(request) {
  // Verify this is an authorised cron call
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Defer heavy imports so they don't run at build time (module-level instantiation
  // would fail during static page collection if env vars aren't yet set).
  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const { Resend } = await import('resend')
  const { clerkClient } = await import('@clerk/nextjs/server')

  // Use the service-role client so this cron can read ALL users' applications
  // without being blocked by user-scoped RLS policies.
  const supabase = createServerSupabaseClient()
  const resend = new Resend(process.env.RESEND_API_KEY)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const threeDaysOut = new Date(today)
  threeDaysOut.setDate(today.getDate() + 3)

  const todayStr = today.toISOString().split('T')[0]
  const threeStr = threeDaysOut.toISOString().split('T')[0]

  const { data: applications, error } = await supabase
    .from('user_applications')
    .select('id, user_id, company, role, deadline, link, status')
    .gte('deadline', todayStr)
    .lte('deadline', threeStr)
    .not('status', 'in', '("Rejected","Offer")')

  if (error) {
    console.error('[Deadline alerts] Supabase error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (!applications?.length) {
    return Response.json({ ok: true, sent: 0 })
  }

  // Group by user_id
  const byUser = {}
  for (const app of applications) {
    if (!byUser[app.user_id]) byUser[app.user_id] = []
    byUser[app.user_id].push(app)
  }

  const clerk = await clerkClient()
  let sent = 0

  for (const [userId, apps] of Object.entries(byUser)) {
    try {
      const user = await clerk.users.getUser(userId)
      const email = user.emailAddresses[0]?.emailAddress
      if (!email) continue

      const rows = apps
        .map((app) => {
          const deadline = new Date(app.deadline)
          const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
          const urgency =
            daysLeft === 0 ? '🔴 Due today'
            : daysLeft === 1 ? '🟠 1 day left'
            : `🟡 ${daysLeft} days left`
          return `
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-weight:600;color:#0f172a">${app.role}</td>
              <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;color:#64748b">${app.company}</td>
              <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;color:#64748b">${urgency}</td>
              ${app.link
                ? `<td style="padding:12px 16px;border-bottom:1px solid #f1f5f9"><a href="${app.link}" style="color:#4f46e5;text-decoration:none;font-weight:500">Apply →</a></td>`
                : '<td></td>'}
            </tr>`
        })
        .join('')

      await resend.emails.send({
        from: 'Placed <alerts@placed.app>',
        to: email,
        subject: `⏰ ${apps.length} application deadline${apps.length !== 1 ? 's' : ''} coming up`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#ffffff">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px">
              <div style="width:32px;height:32px;background:#4f46e5;border-radius:8px;text-align:center;line-height:32px">
                <span style="color:white;font-weight:bold;font-size:14px">P</span>
              </div>
              <span style="font-size:18px;font-weight:600;color:#0f172a">Placed</span>
            </div>

            <h1 style="font-size:24px;font-weight:700;color:#0f172a;margin:0 0 8px">Deadline reminder</h1>
            <p style="font-size:16px;color:#64748b;margin:0 0 24px">
              You have ${apps.length} application${apps.length !== 1 ? 's' : ''} with deadlines in the next 3 days.
            </p>

            <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden;margin-bottom:28px">
              <thead>
                <tr style="background:#f1f5f9">
                  <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Role</th>
                  <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Company</th>
                  <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Deadline</th>
                  <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Link</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>

            <a href="https://placed.app/applications"
               style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px">
              View my applications →
            </a>

            <p style="font-size:13px;color:#94a3b8;margin-top:32px;padding-top:24px;border-top:1px solid #f1f5f9">
              You&apos;re receiving this because you have Placed deadline alerts enabled.
            </p>
          </div>`,
      })

      sent++
    } catch (err) {
      console.error(`[Deadline alerts] Failed for user ${userId}:`, err)
    }
  }

  return Response.json({ ok: true, sent })
}
