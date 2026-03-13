"use client";
import React from 'react';
import { Button } from '@/app/ui/button';
import FeatureLinks from '@/app/ui/feature-links';
import CatalystLogo from '@/app/ui/catalyst-logo';

export default function IntegrationsPage() {
  return (
    <main className="p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <CatalystLogo />
      </div>
      <h1 className="mb-4 text-2xl font-semibold">Integrations</h1>

      <FeatureLinks />

      <div className="space-y-3">
        <div>
          <span className="mr-2">QuickBooks</span>
          <Button onClick={()=>alert('Connect QuickBooks (stub)')}>Connect</Button>
        </div>
        <div>
          <span className="mr-2">Procore</span>
          <Button onClick={()=>alert('Connect Procore (stub)')}>Connect</Button>
        </div>
        <div>
          <span className="mr-2">Buildertrend</span>
          <Button onClick={()=>alert('Connect Buildertrend (stub)')}>Connect</Button>
        </div>
      </div>
    </main>
  );
}
