import { useMemo, useState } from 'react';
import type { User } from '../types';
import Avatar from './Avatar';
import './Sidebar.css';

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function Sidebar({
  users,
  selectedUserId,
  onSelectUser,
  currentUserName,
  onLogout,
}: {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (id: string) => void;
  currentUserName: string;
  onLogout: () => void;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q));
  }, [users, query]);

  const onlineCount = users.filter((u) => u.isOnline).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span className="sidebar-brand-dot" />
          Chat Dashboard
        </div>
      </div>

      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search users"
        />
      </div>

      <div className="sidebar-section-label">
        {onlineCount} online · {users.length} total
      </div>

      <ul className="sidebar-list">
        {filtered.map((user) => (
          <li key={user.id}>
            <button
              className={`sidebar-user${selectedUserId === user.id ? ' sidebar-user--active' : ''}`}
              onClick={() => onSelectUser(user.id)}
            >
              <span className="sidebar-user-avatar">
                <Avatar name={user.name} color={user.avatarColor} />
                <span className={`sidebar-user-status${user.isOnline ? ' sidebar-user-status--online' : ''}`} />
              </span>
              <span className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name}</span>
                <span className="sidebar-user-meta">
                  {user.isOnline ? 'Online' : `Last seen ${relativeTime(user.lastSeen)}`}
                </span>
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="sidebar-empty">No users match "{query}"</li>}
      </ul>

      <div className="sidebar-footer">
        <span className="sidebar-footer-name">{currentUserName}</span>
        <button className="sidebar-footer-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
