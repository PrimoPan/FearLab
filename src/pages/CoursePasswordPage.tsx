import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { projectLabel, projectWidth } from '../components/projects/ProjectReveal'
import { cn } from '../lib/cn'

type Props = {
  checking: boolean
  busy: boolean
  error: string
  onUnlock: (password: string) => Promise<void>
  onRetry: () => Promise<void>
}

export function CoursePasswordPage({ checking, busy, error, onUnlock, onRetry }: Props) {
  const [password, setPassword] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const entered = password
    setPassword('')
    await onUnlock(entered)
  }

  return (
    <section className={cn(projectWidth, 'relative z-[1] flex min-h-[calc(100svh-var(--site-header-height))] flex-col py-8')} aria-labelledby="course-access-title">
      <Link to="/projects" className="inline-flex min-h-11 w-fit items-center text-sm text-ink-soft no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">← All projects</Link>
      <div className="mx-auto my-auto w-full max-w-lg py-14">
        <p className={cn(projectLabel, 'mb-5 mt-0')}>Course access</p>
        <h1 id="course-access-title" className="m-0 text-[clamp(2.75rem,6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.055em]">Enter the<br />course password<span className="text-accent">.</span></h1>
        <p className="mb-8 mt-6 text-base leading-relaxed text-ink-soft">Use the shared course password to view the gallery and student projects.</p>
        {checking ? <p role="status" className="text-ink-soft">Checking access…</p> : (
          <form onSubmit={submit} className="border-t border-line pt-7">
            <label htmlFor="course-password" className="mb-3 block text-sm font-medium">Course password</label>
            <input id="course-password" name="course-password" type="password" autoComplete="current-password" required maxLength={128} value={password} onChange={event => setPassword(event.target.value)} disabled={busy} aria-describedby={error ? 'course-access-error' : undefined} className="min-h-14 w-full rounded-xl border border-line bg-panel px-4 text-base text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-60" />
            {error && <p id="course-access-error" role="alert" className="mb-0 mt-4 text-sm leading-relaxed text-ink">{error}</p>}
            <button type="submit" disabled={busy} className="mt-5 inline-flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-accent bg-accent px-5 text-base font-medium text-site disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              {busy ? 'Checking password…' : 'Enter course'}<span aria-hidden="true">→</span>
            </button>
            {error.includes('unavailable') && <button type="button" onClick={() => void onRetry()} className="mt-3 min-h-11 cursor-pointer border-0 bg-transparent text-sm text-accent underline underline-offset-4">Try again</button>}
          </form>
        )}
      </div>
    </section>
  )
}
