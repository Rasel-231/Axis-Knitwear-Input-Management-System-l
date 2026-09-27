import Link from 'next/link';
import LoginContainer from '../../../modules/auth/LoginContainer';

const capabilities = [
  {
    title: 'Live floor visibility',
    description: 'Cutting, sewing and rib output updated as it happens on the shop floor.',
  },
  {
    title: 'End-to-end traceability',
    description: 'Follow every input lot through each stage to finished goods.',
  },
  {
    title: 'Role-based workspaces',
    description: 'Dedicated controls for administrators, supervisors and line operators.',
  },
];

const lines = ['Cutting', 'Sewing', 'Rib', 'Finishing'];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden overflow-hidden bg-slate-900 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-blue-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 h-[26rem] w-[26rem] rounded-full bg-indigo-600/25 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-lg shadow-black/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 20h18" />
              <path d="M5 20V9l5 3V9l5 3V9l4 2.5V20" />
              <path d="M3 20V12" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide">PMS</p>
            <p className="text-xs text-slate-400">Production Management</p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Real-time production intelligence
          </span>
          <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight xl:text-[2.75rem]">
            Every order, every line, one source of truth.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
            Plan input, monitor line output and close production orders with the accuracy your
            operation depends on.
          </p>

          <ul className="mt-10 space-y-6">
            {capabilities.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-sky-300">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-wrap items-center gap-2 border-t border-white/10 pt-8">
          {lines.map((line) => (
            <span
              key={line}
              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium tracking-wide text-slate-300"
            >
              {line}
            </span>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20h18" />
                <path d="M5 20V9l5 3V9l5 3V9l4 2.5V20" />
                <path d="M3 20V12" />
              </svg>
            </span>
            <p className="text-sm font-semibold text-slate-900">Production Management System</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/[0.04]">
            <header>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h1>
              <p className="mt-2 text-sm text-slate-500">Enter your credentials to open your workspace.</p>
            </header>

            <LoginContainer />

            <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
              Need an account?{' '}
              <Link href="/register" className="font-medium text-slate-900 transition-colors hover:text-slate-600">
                Request access
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Authorised personnel only. All activity is logged.
          </p>
        </div>
      </section>
    </main>
  );
}
