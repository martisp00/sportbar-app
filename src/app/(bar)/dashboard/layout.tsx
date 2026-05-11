import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="max-w-3xl mx-auto w-full px-8 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="font-semibold text-sm">
              SportBar
            </Link>
            <Link
              href="/dashboard/bar"
              className="text-sm text-zinc-500 hover:text-foreground transition-colors"
            >
              Bar profile
            </Link>
            <Link
              href="/dashboard/events"
              className="text-sm text-zinc-500 hover:text-foreground transition-colors"
            >
              Events
            </Link>
          </nav>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-zinc-500 hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="max-w-3xl mx-auto w-full px-8 py-8 flex-1">{children}</div>
    </div>
  )
}
