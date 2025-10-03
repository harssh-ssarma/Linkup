'use client';
import AuthCheck from '@/components/auth/AuthCheck';
import CallSection from '@/components/features/CallSection';
import AppShell from '../AppShell';

export default function CallsPage() {
  return (
    <AuthCheck>
      <AppShell>
        <CallSection />
      </AppShell>
    </AuthCheck>
  );
}
