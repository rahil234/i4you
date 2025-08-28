import type React from 'react';
import { UserNavigation } from '@/components/user-navigation';
import { cn } from '@/lib/utils';

interface UserLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNavigation?: boolean;
}

export function UserLayout({ children, className, hideNavigation = false }: UserLayoutProps) {

  return (
    <div className={cn('bg-gray-50', className)}>
      <main
        className={cn(
          hideNavigation && 'overflow-hidden',
        )}
      >
      </main>
      {children}
      {!hideNavigation && <UserNavigation />}
    </div>
  );
}
