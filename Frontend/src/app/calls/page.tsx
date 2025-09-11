'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CallSection from '@/components/features/CallSection';
import LayoutContent from '../LayoutContent';

export default function CallsPage() {
  return (
    <ProtectedRoute>
      <LayoutContent>
        <CallSection />
      </LayoutContent>
    </ProtectedRoute>
  );
}
