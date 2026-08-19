export function HomeTopbar() {
  return (
    <header className="home-topbar">
      <div className="top-search">
        <span>⌕</span>
        <span>Search tools...</span>
        <kbd>⌘K</kbd>
      </div>
      <nav className="top-tabs" aria-label="Tool filters">
        <span>Favorites</span>
        <span className="top-tab-active">Recent</span>
      </nav>
      <div className="top-actions" aria-label="Utility actions">
        <span>◌</span>
        <span>☆</span>
        <span>◉</span>
      </div>
    </header>
  );
}
