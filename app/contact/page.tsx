import Link from 'next/link';
import CatalystLogo from '@/app/ui/catalyst-logo';

export default function ContactPage() {
  return (
    <main>
      <div className="flex h-20 shrink-0 items-center justify-between rounded-lg bg-blue-500 p-4 md:h-52">
        <CatalystLogo />
        <div className="flex items-center gap-3">
          <Link href="/about" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30">
            About Us
          </Link>
          <Link href="/dashboard" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-8 max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Contact Us</h1>
        <p className="mb-6 text-gray-600">
          Have questions or want to get in touch? Reach out to the Catalyst team.
        </p>
        <div className="space-y-3 text-gray-700">
          <p><span className="font-medium">Email:</span> info@catalystai.com</p>
          <p><span className="font-medium">Phone:</span> (555) 000-0000</p>
          <p><span className="font-medium">Address:</span> 123 Construction Ave, Suite 100</p>
        </div>
      </div>
    </main>
  );
}
