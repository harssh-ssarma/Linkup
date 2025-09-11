'use client';
import AuthCheck from '@/components/auth/AuthCheck';
import CallSection from '@/components/features/CallSection';
import LayoutContent from '../LayoutContent';

export default function CallsPage() {
  return (
    <AuthCheck>
      <LayoutContent>
        <CallSection />
      </LayoutContent>
    </AuthCheck>
  );
}
