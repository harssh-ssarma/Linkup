'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CreateSection from '@/components/features/CreateSection';
import LayoutContent from '../LayoutContent';

export default function CreatePage() {
  return (
    <ProtectedRoute>
      <LayoutContent>
        <CreateSection />
      </LayoutContent>
    </ProtectedRoute>
  );
}
