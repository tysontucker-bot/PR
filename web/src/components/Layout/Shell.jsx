import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';

export default function Shell({ view, onNavigate, darkMode, onToggleDark, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="shell">
      {/* Mobile header */}
      <header className="mobile-header">
        <button
          className="btn-icon"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <span className="app-title-small">Progress Report Assistant</span>
      </header>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="shell-body">
        <Sidebar
          view={view}
          onNavigate={(v) => {
            onNavigate(v);
            setSidebarOpen(false);
          }}
          darkMode={darkMode}
          onToggleDark={onToggleDark}
          isOpen={sidebarOpen}
        />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
