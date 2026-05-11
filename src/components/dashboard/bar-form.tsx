'use client'

import { useActionState, useState } from 'react'
import { upsertBar } from '@/app/actions/bar'
import type { Bar } from '@/types/database'

const inputClass =
  'w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/10 dark:focus:border-zinc-500'

const labelClass = 'block text-sm font-medium mb-1.5'

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function BarForm({ bar }: { bar: Bar | null }) {
  const [error, action, isPending] = useActionState(upsertBar, null)
  const [name, setName] = useState(bar?.name ?? '')
  const [slug, setSlug] = useState(bar?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!bar?.slug)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setName(val)
    if (!slugTouched) setSlug(toSlug(val))
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value)
    setSlugTouched(true)
  }

  return (
    <form action={action} className="space-y-5 max-w-lg">
      {bar && <input type="hidden" name="id" value={bar.id} />}

      <div>
        <label htmlFor="name" className={labelClass}>Bar name *</label>
        <input
          id="name"
          name="name"
          required
          value={name}
          onChange={handleNameChange}
          className={inputClass}
          placeholder="The Offside Tap"
        />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          Slug *{' '}
          <span className="font-normal text-zinc-400">(used in the public URL)</span>
        </label>
        <input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={handleSlugChange}
          className={inputClass}
          placeholder="the-offside-tap"
        />
      </div>

      <div>
        <label htmlFor="address" className={labelClass}>Address *</label>
        <input
          id="address"
          name="address"
          required
          defaultValue={bar?.address ?? ''}
          className={inputClass}
          placeholder="123 Main St"
        />
      </div>

      <div>
        <label htmlFor="city" className={labelClass}>City *</label>
        <input
          id="city"
          name="city"
          required
          defaultValue={bar?.city ?? ''}
          className={inputClass}
          placeholder="Barcelona"
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={bar?.description ?? ''}
          className={inputClass}
          placeholder="A great place to watch the game…"
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={bar?.phone ?? ''}
          className={inputClass}
          placeholder="+34 600 000 000"
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
        className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-50"
      >
        {isPending ? 'Saving…' : bar ? 'Save changes' : 'Create bar'}
      </button>
    </form>
  )
}
