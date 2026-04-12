import { currentUser } from '@clerk/nextjs/server'

export const metadata = { title: 'Settings — Placed' }

export default async function SettingsPage() {
  const user = await currentUser()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Avatar" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-lg">
                {user?.firstName?.[0] ?? '?'}
              </div>
            )}
            <div>
              <p className="font-medium text-slate-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-slate-500">
                {user?.emailAddresses?.[0]?.emailAddress ?? '—'}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Manage your profile details via the account portal.
          </p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: 'Application deadline reminders', desc: 'Get notified before deadlines approach' },
              { label: 'New matching listings', desc: 'Be alerted when new internships match your profile' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <h2 className="font-semibold text-red-600 mb-2">Danger zone</h2>
          <p className="text-sm text-slate-500 mb-4">
            Permanently delete your account and all your data.
          </p>
          <button className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium">
            Delete account
          </button>
        </div>
      </div>
    </div>
  )
}
