import type { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';

interface AppShellProps {
  children: ReactNode;
  activeNav?: string;
  hideNav?: boolean;
  className?: string;
}

export function AppShell({ children, activeNav, hideNav, className = '' }: AppShellProps) {
  return (
    <main className={`phone ${className}`}>
      <section className={hideNav ? 'screen-content no-nav' : 'screen-content'}>{children}</section>
      {!hideNav && <BottomNavigation active={activeNav} />}
    </main>
  );
}
