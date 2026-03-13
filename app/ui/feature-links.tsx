import Link from 'next/link';

export default function FeatureLinks() {
  return (
    <div className="mt-6 flex flex-col items-start gap-3">
      <Link href="/dashboard" className="w-40 rounded-lg bg-sky-500 px-4 py-2 text-center text-sm text-white hover:bg-sky-600">
        Dashboard
      </Link>
      <Link href="/estimator" className="w-40 rounded-lg bg-green-500 px-4 py-2 text-center text-sm text-white hover:bg-green-600">
        Estimator
      </Link>
      <Link href="/assistant" className="w-40 rounded-lg bg-indigo-500 px-4 py-2 text-center text-sm text-white hover:bg-indigo-600">
        Assistant
      </Link>
      <Link href="/scheduler" className="w-40 rounded-lg bg-yellow-500 px-4 py-2 text-center text-sm text-white hover:bg-yellow-600">
        Scheduler
      </Link>
      <Link href="/safety" className="w-40 rounded-lg bg-red-500 px-4 py-2 text-center text-sm text-white hover:bg-red-600">
        Safety
      </Link>
      <Link href="/integrations" className="w-40 rounded-lg bg-purple-500 px-4 py-2 text-center text-sm text-white hover:bg-purple-600">
        Integrations
      </Link>
    </div>
  );
}
