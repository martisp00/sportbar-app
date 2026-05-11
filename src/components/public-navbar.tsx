import Link from 'next/link'

export function PublicNavbar() {
  return (
    <header className="border-b border-black/10 dark:border-white/10 bg-background z-10">
      <div className="max-w-7xl mx-auto w-full px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-sm">
          SportBar
        </Link>
        <Link
          href="/login"
          className="text-sm text-zinc-500 hover:text-foreground transition-colors"
        >
          Are you a bar owner?{' '}
          <span className="font-medium text-foreground">Sign in →</span>
        </Link>
      </div>
    </header>
  )
}
