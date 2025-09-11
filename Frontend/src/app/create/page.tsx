'use client';
import AuthCheck from '@/components/auth/AuthCheck';
import CreateSection from '@/components/features/CreateSection';
import LayoutContent from '../LayoutContent';

export default function CreatePage() {
  return (
    <AuthCheck>
      <LayoutContent>
        <CreateSection />
      </LayoutContent>
    </AuthCheck>
  );
}
