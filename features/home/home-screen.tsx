import Link from 'next/link';

import { HomeTopbar } from '@/components/layout/home-topbar';
import { tools } from '@/lib/tools';

export function HomeScreen() {
  const popularTools = tools;
  const recentTools = [tools[1], tools[0], tools[2]];

  return (
    <>
      <HomeTopbar />
      <section className="home-hero">
        <p className="eyebrow">Utility suite</p>
        <h1>Developer tools that just work.</h1>
        <p>Fast utilities for developers, testers, and engineers—directly in your browser.</p>
        <div className="home-command">
          <span>⌕</span>
          <span>What do you want to do? e.g. Decode JWT, Format JSON</span>
        </div>
      </section>
      <div className="home-content">
        <section className="popular-section">
          <div className="home-section-heading">
            <p className="eyebrow">Popular tools</p>
            <Link className="view-all" href="/history">
              Saved runs
            </Link>
          </div>
          <div className="popular-grid">
            {popularTools.map((tool) => (
              <Link className="card tool-card home-tool-card" href={tool.href} key={tool.href}>
                <div className="tool-card-top">
                  <span className="tool-icon">{tool.icon}</span>
                </div>
                <h2>{tool.label}</h2>
                <p>{tool.description}</p>
                <span className="tool-link">{tool.category}</span>
              </Link>
            ))}
          </div>
        </section>
        <aside className="recent-panel">
          <p className="eyebrow">Recently used</p>
          {recentTools.map((tool, index) => (
            <Link className="recent-item" href={tool.href} key={tool.href}>
              <span className="recent-icon">{tool.icon}</span>
              <span>
                <strong>{tool.label}</strong>
                <small>
                  {index === 0 ? '2 min ago' : index === 1 ? '1 hour ago' : 'Yesterday'}
                </small>
              </span>
            </Link>
          ))}
        </aside>
      </div>
    </>
  );
}
