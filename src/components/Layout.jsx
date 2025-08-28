import { useTheme } from '../hooks/useTheme';

const Layout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="layout">
      {/* Header */}
      <header className="layout-header">
        <div className="header-content">
          <h1 className="app-title">AI Studio</h1>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div className="theme-icon">
              {isDark ? (
                // Sun icon for dark mode (switch to light)
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <circle cx="12" cy="12" r="4" fill="currentColor"/>
                  <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                // Moon icon for light mode (switch to dark)
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
                </svg>
              )}
            </div>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="layout-main">
        {/* Left Sidebar - Future Prompt/Chat Area */}
        <aside className="layout-sidebar">
          <div className="sidebar-placeholder">
            <div className="placeholder-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="placeholder-text">Chat & Prompts</p>
            <span className="placeholder-subtitle">Coming Soon</span>
          </div>
        </aside>

        {/* Main Content */}
        <section className="layout-content">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout; 