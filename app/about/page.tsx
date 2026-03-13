import Link from 'next/link';
import CatalystLogo from '@/app/ui/catalyst-logo';

export default function AboutPage() {
  return (
    <main>
      <div className="flex h-20 shrink-0 items-center justify-between rounded-lg bg-blue-500 p-4 md:h-52">
        <CatalystLogo />
        <div className="flex items-center gap-3">
          <Link href="/contact" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30">
            Contact Us
          </Link>
          <Link href="/dashboard" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-8 max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">About Catalyst</h1>
        <p className="mb-4 text-gray-600">
          Catalyst is an AI-powered platform built for the construction industry. We help teams
          manage estimates, scheduling, safety, and project documentation — all in one place.
        </p>
        <p className="text-gray-600">
          Our mission is to bring intelligent automation to construction professionals so they can
          focus on building great things.
        </p>
      </div>
    </main>
  );
}
