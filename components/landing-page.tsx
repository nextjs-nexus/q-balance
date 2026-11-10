import Image from "next/image";
import Link from "next/link";

import DemoSignInButton from "./demo-sign-in-button";

const features = [
  {
    number: "01",
    title: "A little daily habit.",
    description: "Record income and expenses as they happen. Add items, quantities, and notes so the details are always there.",
  },
  {
    number: "02",
    title: "Every record, in order.",
    description: "Browse your transactions in a clear list. Filter by date and category to find exactly what you need.",
  },
  {
    number: "03",
    title: "The bigger picture.",
    description: "Group transactions by category, compare income with spending, and see your balance over time.",
  },
];

const openToEveryone = [
  "Dashboard with income and expense charts by week, month, or six months",
  "Transaction lists filtered by date, type, and category",
  "Categories, items, and totals by category",
];

const afterLogIn = [
  "Add categories, items, and income or expense transactions",
  "Edit and delete your records",
  "Keep your own private data",
];

export default function LandingPage({ demoAvailable }: { demoAvailable: boolean }) {
  return (
    <div className="min-h-dvh bg-[#f7f8f2] text-[#193c32] selection:bg-[#d9e9bc]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <header className="flex items-center justify-between gap-4 border-b border-[#193c32]/10 py-6">
          <Link href="/" aria-label="Q-Balance home" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#d9e9bc]">
              <Image src="/logo.svg" width={20} height={20} alt="" />
            </span>
            Q-Balance<span className="text-[#719077]">.</span>
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium sm:gap-8">
            <a href="#what-you-can-do" className="hidden hover:text-[#567d45] sm:block">What you can do</a>
            <Link href="/signin" className="hover:text-[#567d45]">Sign in</Link>
            <Link href="/signup" className="rounded-full border border-[#193c32]/25 px-4 py-2.5 hover:bg-[#e8eddc]">Sign up <span aria-hidden="true">↗</span></Link>
          </nav>
        </header>

        <section aria-labelledby="landing-title" className="grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-24">
          <div>
            <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-[#52705a]">
              <span className="size-1.5 rounded-full bg-[#78914d]" />
              No account needed to browse
            </p>
            <h1 id="landing-title" className="max-w-xl text-5xl font-medium leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem]">
              Less guessing.<br />
              <span className="font-serif italic text-[#6b824d]">More balance.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-[#627169] sm:text-lg">
              A clearer view of what comes in and what goes out. Track your income and expenses, find patterns, and make sense of your money. All in one free app.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href="/dashboard" className="inline-flex items-center gap-7 rounded-full bg-[#193c32] px-6 py-3.5 text-sm font-medium text-white hover:-translate-y-0.5 hover:bg-[#2b5345] motion-reduce:transform-none">
                Start browsing, no sign-up <span aria-hidden="true">↗</span>
              </Link>
              {demoAvailable && (
                <DemoSignInButton variant="outline" label="Try the demo account" />
              )}
            </div>
            <p className="mt-5 max-w-md text-xs leading-5 text-[#738074]">
              Anyone can browse six months of sample income and expenses. Adding and editing records is available after you log in.{" "}
              <Link href="/signup" className="font-medium text-[#193c32] underline underline-offset-4">Sign up free</Link>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div aria-hidden="true" className="absolute -inset-5 rounded-full bg-[radial-gradient(ellipse_at_center,#dfe8ca_0%,transparent_70%)] sm:-inset-12" />
            <figure aria-label="Illustrative monthly report: income 3,200 euros, expenses 1,245 euros, balance 1,955 euros" className="relative rotate-[-2deg] rounded-[1.75rem] border border-[#193c32]/10 bg-white p-6 shadow-[0_24px_70px_-25px_#193c3238] sm:p-8">
              <figcaption className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold">Your money, at a glance</span>
                <span className="rounded-full bg-[#f1f4ec] px-3 py-1 text-xs text-[#6a776c]">Example month</span>
              </figcaption>
              <p className="mt-8 text-xs text-[#748077]">Total balance</p>
              <p className="mt-2 text-5xl font-medium tracking-[-0.05em]">€1,955<span className="text-3xl text-[#9aa59d]">.00</span></p>
              <div className="mt-6 grid grid-cols-2 gap-4 border-y border-[#edf0e9] py-4">
                <div><p className="text-xs text-[#748077]"><span className="mr-1 text-[#648245]">↙</span> Income</p><p className="mt-1 text-lg font-medium">€3,200.00</p></div>
                <div><p className="text-xs text-[#748077]"><span className="mr-1 text-[#b28a64]">↗</span> Expenses</p><p className="mt-1 text-lg font-medium">€1,245.00</p></div>
              </div>
              <svg viewBox="0 0 400 136" fill="none" aria-hidden="true" className="mt-6 w-full overflow-visible">
                <path d="M0 30H400M0 75H400M0 120H400" stroke="#edf0e9" strokeDasharray="3 5" />
                <path d="M0 112C25 112 25 83 55 83S91 99 120 75S155 86 185 61S225 70 255 43S300 52 330 28S370 32 400 8V136H0Z" fill="#f0f5e6" />
                <path d="M0 112C25 112 25 83 55 83S91 99 120 75S155 86 185 61S225 70 255 43S300 52 330 28S370 32 400 8" pathLength="1" stroke="#75944e" strokeWidth="3" strokeLinecap="round" className="motion-safe:animate-balance-line" />
                <path d="M0 120C40 118 45 104 80 110S130 95 165 104S210 83 250 92S295 70 330 81S375 65 400 69" pathLength="1" stroke="#c3a584" strokeWidth="2" strokeLinecap="round" className="motion-safe:animate-balance-line" />
              </svg>
              <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-[#8a948c]"><span>Start of month</span><span>End of month</span></div>
              <div className="mt-6 flex items-center justify-between border-t border-[#edf0e9] pt-4 text-xs"><span className="text-[#748077]">A place for every expense</span><span className="rounded-full bg-[#f1f4ec] px-3 py-1.5">Groceries · €245</span></div>
            </figure>
            <div className="relative ml-auto -mt-2 mr-3 w-fit rotate-[2deg] rounded-xl border border-[#d9e4c9] bg-[#e5edda] px-5 py-3 text-xs font-medium shadow-sm sm:-mr-4">↗ &nbsp; Small habits. A clearer picture.</div>
            <p className="mt-5 text-center text-[11px] text-[#849080]">Illustrative data. Your own story starts with your first entry.</p>
          </div>
        </section>

        <section id="what-you-can-do" aria-labelledby="access-title" className="border-t border-[#193c32]/15 py-10 sm:py-12">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="access-title" className="text-xl font-medium tracking-tight">What you can do</h2>
            <span className="text-xs text-[#738074]">Browse first. Sign up when you are ready.</span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-[#193c32]/10 bg-white p-6">
              <h3 className="text-base font-semibold">Open to everyone</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[#69766c]">
                {openToEveryone.map((feature) => (
                  <li key={feature} className="flex gap-2"><span aria-hidden="true" className="text-[#648245]">✓</span>{feature}</li>
                ))}
              </ul>
              <Link href="/dashboard" className="mt-5 inline-block text-sm font-medium underline decoration-[#193c32]/30 underline-offset-4 hover:decoration-[#193c32]">Start browsing</Link>
            </article>
            <article className="rounded-2xl border border-[#193c32]/10 bg-white p-6">
              <h3 className="text-base font-semibold">After you log in</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[#69766c]">
                {afterLogIn.map((feature) => (
                  <li key={feature} className="flex gap-2"><span aria-hidden="true" className="text-[#b28a64]">＋</span>{feature}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium">
                <Link href="/signin" className="underline decoration-[#193c32]/30 underline-offset-4 hover:decoration-[#193c32]">Log in</Link>
                <Link href="/signup" className="underline decoration-[#193c32]/30 underline-offset-4 hover:decoration-[#193c32]">Sign up free</Link>
              </div>
            </article>
            <article className="rounded-2xl border border-[#d9e4c9] bg-[#e5edda] p-6">
              <h3 className="text-base font-semibold">Try the demo account</h3>
              <p className="mt-4 text-sm leading-6 text-[#4f5f54]">
                Want to try adding and editing without signing up? Use the shared demo account. It has its own copy of the sample data, and changes reset every day.
              </p>
              {demoAvailable ? (
                <div className="mt-5">
                  <DemoSignInButton variant="primary" label="Open the demo account" />
                </div>
              ) : (
                <p className="mt-5 text-sm text-[#4f5f54]">The demo account is not available right now.</p>
              )}
            </article>
          </div>
        </section>

        <section id="how-it-works" aria-labelledby="features-title" className="border-t border-[#193c32]/15 py-10 sm:py-12">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="features-title" className="text-xl font-medium tracking-tight">From daily details to a clearer picture.</h2>
            <span className="text-xs text-[#738074]">Simple by design.</span>
          </div>
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {features.map((feature) => (
              <article key={feature.number}>
                <span className="font-mono text-xs text-[#869676]">{feature.number} /</span>
                <h3 className="mt-3 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#69766c]">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#193c32]/10 py-6 text-xs text-[#738074]">
          <span>Q-Balance · A little clarity, every day.</span>
          <Link href="/signup" className="font-medium text-[#193c32] hover:underline">Find your balance. Start for free <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>
    </div>
  );
}
