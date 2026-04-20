'use client';

import { Navbar } from '@/components/layout/Navbar';
import { PersonalView } from '@/components/dashboard/PersonalView';
import { TeamView } from '@/components/dashboard/TeamView';
import { useDashboardStore } from '@/store/dashboardStore';

export default function DashboardPage() {
  const { view, period, repIdx } = useDashboardStore();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {view === 'personal' ? (
          <PersonalView key={`${repIdx}-${period}`} />
        ) : (
          <TeamView key={period} />
        )}
      </main>
    </div>
  );
}
