import React from 'react';
import { UserLayout } from '@/components/user-layout';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserLayout>
      {children}
    </UserLayout>
  );
}