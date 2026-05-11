import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BarForm } from '@/components/dashboard/bar-form'

export default async function BarProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bar } = await supabase
    .from('bars')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-foreground transition-colors"
      >
        ← Back
      </Link>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Bar profile</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {bar ? 'Update your bar details.' : 'Set up your bar to start adding events.'}
        </p>
      </div>
      <BarForm bar={bar ?? null} />
    </div>
  )
}
