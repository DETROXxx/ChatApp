import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Message, User } from '../types';
import Avatar from './Avatar';
import './ChatWindow.css';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatDay(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return 'Today';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ChatWindow({
  user,
  messages,
  onSend,
}: {
  user: User | null;
  messages: Message[];
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, user?.id]);

  if (!user) {
    return (
      <section className="chat-window chat-window--empty">
        <div className="chat-empty">
          <h2>Select someone to message</h2>
          <p>Pick a person from the list on the left to see your conversation and send them a message.</p>
        </div>
      </section>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
  };

  let lastDay = '';

  return (
    <section className="chat-window">
      <header className="chat-header">
        <Avatar name={user.name} color={user.avatarColor} size={38} />
        <div className="chat-header-info">
          <h2>{user.name}</h2>
          <p className={user.isOnline ? 'chat-header-online' : ''}>
            {user.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </header>

      <div className="chat-scroll" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-thread-empty">
            No messages yet. Say hello to {user.name.split(' ')[0]}.
          </div>
        )}
        {messages.map((m) => {
          const day = formatDay(m.createdAt);
          const showDayDivider = day !== lastDay;
          lastDay = day;
          const isMine = m.senderId === 'me';
          return (
            <div key={m.id}>
              {showDayDivider && <div className="chat-day-divider">{day}</div>}
              <div className={`chat-bubble-row${isMine ? ' chat-bubble-row--mine' : ''}`}>
                <div className={`chat-bubble${isMine ? ' chat-bubble--mine' : ''}`}>
                  <p>{m.text}</p>
                  <span className="chat-bubble-time">{formatTime(m.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form className="chat-composer" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={`Message ${user.name.split(' ')[0]}…`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Type a message"
        />
        <button type="submit" disabled={!draft.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}
