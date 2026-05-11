'use client'

import { useActionState, useState } from 'react'
import { signIn, signUp } from '@/app/actions/auth'

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [signInError, signInAction, isSigningIn] = useActionState(signIn, null)
  const [signUpError, signUpAction, isSigningUp] = useActionState(signUp, null)

  const isLogin = mode === 'login'
  const action = isLogin ? signInAction : signUpAction
  const error = isLogin ? signInError : signUpError
  const isPending = isLogin ? isSigningIn : isSigningUp

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isLogin ? 'Sign in' : 'Create account'}
        </h1>
        <p className="text-sm text-zinc-500">
          {isLogin ? 'Welcome back.' : 'Start managing your bar.'}
        </p>
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/10 dark:focus:border-zinc-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            minLength={6}
            className="w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/10 dark:focus:border-zinc-500"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-foreground py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-50"
        >
          {isPending ? 'Loading…' : isLogin ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          onClick={() => setMode(isLogin ? 'signup' : 'login')}
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}
