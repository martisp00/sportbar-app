import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bar } = await supabase
    .from('bars')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  redirect(bar ? '/dashboard/events' : '/dashboard/bar')
}
