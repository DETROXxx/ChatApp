import type { ReactNode } from 'react';
import './AuthLayout.css';

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="auth-brand-mark">
          <span className="auth-brand-dot" />
          Chat Dashboard
        </div>
        <div className="auth-brand-copy">
          <h1>Conversations, in one place.</h1>
          <p>See who's online, pick up where you left off, and message your team without refreshing a page.</p>
        </div>
        <ul className="auth-brand-list">
          <li>Real-time delivery</li>
          <li>Online status at a glance</li>
          <li>Full message history</li>
        </ul>
      </aside>
      <main className="auth-panel">
        <div className="auth-panel-inner">
          <header className="auth-panel-header">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
