import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { FeedPost } from '../types';

interface StoriesBarProps {
  posts: FeedPost[];
  onCreate: () => void;
}

interface StoryGroup {
  author: string;
  avatar?: string;
  neighborhood: string;
  items: { id: string; image: string; caption: string; timeAgo: string }[];
}

const SEEN_KEY = 'sobradinho_stories_seen_v1';
const DURATION = 5000;

function readSeen(): string[] {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { return []; }
}

export const StoriesBar: React.FC<StoriesBarProps> = ({ posts, onCreate }) => {
  const [seen, setSeen] = useState<string[]>(readSeen);
  const [open, setOpen] = useState<number | null>(null);

  const groups = useMemo<StoryGroup[]>(() => {
    const map = new Map<string, StoryGroup>();
    posts.forEach((p) => {
      if (!p.imageUrl) return;
      const g = map.get(p.authorName) || { author: p.authorName, avatar: p.authorAvatar, neighborhood: p.neighborhood, items: [] };
      g.items.push({ id: p.id, image: p.imageUrl, caption: p.content, timeAgo: p.timeAgo });
      map.set(p.authorName, g);
    });
    return Array.from(map.values());
  }, [posts]);

  const markSeen = (author: string) => {
    setSeen((prev) => {
      if (prev.includes(author)) return prev;
      const next = [...prev, author];
      try { localStorage.setItem(SEEN_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 py-4 bg-white">
        <button onClick={onCreate} className="flex flex-col items-center gap-1.5 shrink-0 w-[72px]" aria-label="Criar story">
          <span className="w-[68px] h-[68px] rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center text-blue-600">
            <Plus className="w-7 h-7" strokeWidth={2.4} />
          </span>
          <span className="text-xs font-semibold text-zinc-700">Seu story</span>
        </button>
        {groups.map((g, i) => {
          const isSeen = seen.includes(g.author);
          return (
            <button key={g.author} onClick={() => setOpen(i)} className="flex flex-col items-center gap-1.5 shrink-0 w-[72px]" aria-label={`Ver story de ${g.author}`}>
              <span className={`p-[3px] rounded-full ${isSeen ? 'bg-zinc-300' : 'bg-gradient-to-tr from-blue-600 via-fuchsia-500 to-orange-400'}`}>
                <span className="block w-[62px] h-[62px] rounded-full overflow-hidden bg-white p-[2px]">
                  {g.avatar ? (
                    <img src={g.avatar} alt="" className="w-full h-full rounded-full object-cover" loading="lazy" />
                  ) : (
                    <span className="w-full h-full rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center">
                      {g.author.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
              </span>
              <span className="text-xs font-semibold text-zinc-700 truncate w-full text-center">{g.author.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {open !== null && groups[open] && (
        <StoryViewer
          groups={groups}
          startGroup={open}
          onSeen={markSeen}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
};

const StoryViewer: React.FC<{
  groups: StoryGroup[];
  startGroup: number;
  onSeen: (author: string) => void;
  onClose: () => void;
}> = ({ groups, startGroup, onSeen, onClose }) => {
  const [g, setG] = useState(startGroup);
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(0);
  const paused = useRef(false);
  const group = groups[g];

  const next = () => {
    if (i < group.items.length - 1) { setI(i + 1); setProgress(0); }
    else if (g < groups.length - 1) { onSeen(group.author); setG(g + 1); setI(0); setProgress(0); }
    else { onSeen(group.author); onClose(); }
  };
  const prev = () => {
    if (i > 0) { setI(i - 1); setProgress(0); }
    else if (g > 0) { setG(g - 1); setI(0); setProgress(0); }
    else setProgress(0);
  };

  useEffect(() => {
    const t = setInterval(() => {
      if (paused.current) return;
      setProgress((p) => {
        const np = p + 100 / (DURATION / 50);
        return np >= 100 ? 100 : np;
      });
    }, 50);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress >= 100) next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g, i]);

  const item = group.items[i];

  return (
    <div className="fixed inset-0 z-[70] bg-black flex justify-center select-none">
      <div className="relative w-full max-w-md h-full">
        <img src={item.image} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/75 to-transparent" />

        <div className="absolute inset-x-0 top-0 px-3 pt-[max(12px,env(safe-area-inset-top))]">
          <div className="flex gap-1">
            {group.items.map((_, idx) => (
              <div key={idx} className="h-[3px] flex-1 bg-white/35 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: idx < i ? '100%' : idx === i ? `${progress}%` : '0%' }} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                {group.avatar ? <img src={group.avatar} alt="" className="w-full h-full object-cover" /> : group.author.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{group.author}</p>
                <p className="text-xs text-white/80 truncate">{group.neighborhood} · {item.timeAgo}</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Fechar" className="w-11 h-11 -mr-2 flex items-center justify-center text-white">
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>

        <p className="absolute inset-x-0 bottom-0 px-5 pb-[max(28px,env(safe-area-inset-bottom))] text-base text-white leading-relaxed line-clamp-5">
          {item.caption}
        </p>

        <div
          className="absolute inset-x-0 top-24 bottom-28 flex"
          onPointerDown={() => (paused.current = true)}
          onPointerUp={() => (paused.current = false)}
          onPointerLeave={() => (paused.current = false)}
        >
          <button className="w-1/3 h-full" onClick={prev} aria-label="Anterior" />
          <button className="w-2/3 h-full" onClick={next} aria-label="Próximo" />
        </div>
      </div>
    </div>
  );
};
