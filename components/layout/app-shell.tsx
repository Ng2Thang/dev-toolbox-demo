'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { primaryNavigation } from '@/lib/tools';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <aside className="side">
        <Link className="brand" href="/">
          <span className="brand-mark">⌁</span>
          <span>
            <strong>Dev Toolbox</strong>
            <small>Utility suite</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="nav">
          {primaryNavigation.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                className={`nav-link${isActive ? ' nav-link-active' : ''}`}
                href={item.href}
                key={item.href}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="side-footer">
          <div className="side-footer-item">
            <span>⚙</span>
            <span>Settings</span>
          </div>
          <div className="side-footer-item">
            <span>◐</span>
            <span>Dark mode</span>
          </div>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
