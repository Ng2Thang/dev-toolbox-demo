import { createElement } from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AppShell } from '@/components/layout/app-shell';
import { HomeScreen } from '@/features/home/home-screen';
import { tools } from '@/lib/tools';

import { formatJson } from './json/json';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('tool utilities', () => {
  it('formats JSON and reports invalid input through its caller', () => {
    expect(formatJson('{"status":"ready"}')).toBe('{\n  "status": "ready"\n}');
    expect(() => formatJson('{')).toThrow();
  });

  it('renders every registered tool on Home in registry order', () => {
    const { container } = render(createElement(HomeScreen));
    const popularGrid = container.querySelector('.popular-grid');

    expect(popularGrid).not.toBeNull();
    expect(
      within(popularGrid as HTMLElement)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(tools.map((tool) => tool.href));
  });

  it('renders every registered tool in the sidebar in registry order', () => {
    render(createElement(AppShell, null, createElement('div', undefined, 'Tool content')));
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' });

    expect(
      within(navigation)
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.startsWith('/tools/'))
        .map((link) => link.getAttribute('href')),
    ).toEqual(tools.map((tool) => tool.href));
  });
});
