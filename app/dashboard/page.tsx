import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import FeatureLinks from '@/app/ui/feature-links';
import LogoutButton from '@/app/ui/logout-button';
import CatalystLogo from '@/app/ui/catalyst-logo';
import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import {
  CardSkeleton,
  CardsSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from '@/app/ui/skeletons';

export default async function Page() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <main>
      <div className="flex h-20 shrink-0 items-center justify-between rounded-lg bg-blue-500 p-4 md:h-52">
        <CatalystLogo />
        <div className="flex items-center gap-3">
          <a href="/about" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30">
            About Us
          </a>
          <a href="/contact" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30">
            Contact Us
          </a>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-6 flex gap-6">
        {/* Left sidebar nav */}
        <aside className="shrink-0">
          <FeatureLinks />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<CardsSkeleton />}>
              <Card title="Collected" value={totalPaidInvoices} type="collected" />
              <Card title="Pending" value={totalPendingInvoices} type="pending" />
              <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
              <Card title="Total Customers" value={numberOfCustomers} type="customers" />
            </Suspense>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            <Suspense fallback={<RevenueChartSkeleton />}>
              <RevenueChart />
            </Suspense>
            <Suspense fallback={<LatestInvoicesSkeleton />}>
              <LatestInvoices />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
