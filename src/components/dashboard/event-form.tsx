'use client'

import { useActionState } from 'react'
import { createEvent } from '@/app/actions/events'
import type { SportsCatalog } from '@/types/database'

const inputClass =
  'w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/10 dark:focus:border-zinc-500'

const labelClass = 'text-sm font-medium'

export function EventForm({
  barId,
  sports,
}: {
  barId: string
  sports: SportsCatalog[]
}) {
  const [error, action, isPending] = useActionState(createEvent, null)

  return (
    <form action={action} className="space-y-5 max-w-lg">
      <input type="hidden" name="bar_id" value={barId} />

      <div className="space-y-1.5">
        <label htmlFor="title" className={labelClass}>Title *</label>
        <input
          id="title"
          name="title"
          required
          className={inputClass}
          placeholder="Champions League Final"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sport_id" className={labelClass}>Sport *</label>
        <select id="sport_id" name="sport_id" required className={inputClass}>
          <option value="">Select a sport…</option>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="starts_at" className={labelClass}>Starts at *</label>
          <input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            required
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="ends_at" className={labelClass}>Ends at</label>
          <input
            id="ends_at"
            name="ends_at"
            type="datetime-local"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="screen_count" className={labelClass}>Screens showing this</label>
        <input
          id="screen_count"
          name="screen_count"
          type="number"
          min="1"
          defaultValue={1}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className={labelClass}>Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className={inputClass}
          placeholder="Sound on, reservations recommended…"
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
        {isPending ? 'Saving…' : 'Add event'}
      </button>
    </form>
  )
}
