import React from 'react';

const NAV_ITEMS = [
  { id: 'students', label: 'Students', icon: '👥' },
  { id: 'comment-bank', label: 'Comment Bank', icon: '📝' },
];

export default function Sidebar({ view, onNavigate, darkMode, onToggleDark, isOpen }) {
  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand">Progress Report Assistant</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item${view === item.id || (view === 'student-detail' && item.id === 'students') ? ' sidebar-nav-item--active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="sidebar-bottom">
        <button
          className="btn btn-secondary sidebar-dark-toggle"
          onClick={onToggleDark}
          title="Toggle dark mode"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <p className="sidebar-footer-text">All data stored locally</p>
      </div>
    </aside>
  );
}
