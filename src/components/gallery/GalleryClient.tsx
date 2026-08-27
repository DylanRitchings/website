'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { LayoutGrid, X } from 'lucide-react';
import type { GalleryImage } from './types';
import { scrollInstantly } from './scrollInstantly';
import { useViewport } from './useViewport';
import { GridThumb } from './GridThumb';
import { Photo } from './Photo';
import { FullImage } from './FullImage';

export type { GalleryImage };

interface GalleryClientProps {
  images: GalleryImage[];
}

export default function GalleryClient({ images }: GalleryClientProps) {
  const [mode, setMode] = useState<'focus' | 'grid'>('focus');
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  // focusedIndex carries over from focus mode (or a prior grid session), so
  // without this the grid selection border would show immediately on
  // entering gallery mode rather than only after an actual keypress there.
  const [gridBorderVisible, setGridBorderVisible] = useState(false);
  const preloadedRef = useRef<Set<string>>(new Set());
  const [preloaded, setPreloaded] = useState<Set<string>>(new Set());
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const viewport = useViewport();

  // Mirror the state that keyboard nav depends on, so a keydown fired mid-render
  // (e.g. from OS key-repeat) always reads the true latest value instead of a
  // stale closure from the last time the listener was (re)subscribed.
  const modeRef = useRef(mode);
  const selectedRef = useRef(selected);
  const focusedIndexRef = useRef(focusedIndex);

  const markPreloaded = useCallback((filename: string) => {
    preloadedRef.current.add(filename);
    setPreloaded(new Set(preloadedRef.current));
  }, []);

  // Preload the next 2 images ahead of a given index
  const preloadAhead = useCallback((index: number) => {
    [index + 1, index + 2].forEach(i => {
      if (i < images.length && !preloadedRef.current.has(images[i].filename)) {
        const img = new window.Image();
        img.onload = img.onerror = () => markPreloaded(images[i].filename);
        img.src = `/resized/2000/${images[i].filename}`;
      }
    });
  }, [images, markPreloaded]);

  const priorityLoad = useCallback((image: GalleryImage) => {
    if (!preloadedRef.current.has(image.filename)) {
      const img = new window.Image();
      img.onload = img.onerror = () => markPreloaded(image.filename);
      img.src = `/resized/2000/${image.filename}`;
    }
  }, [markPreloaded]);

  // Reflect the current app state in the URL so it's shareable/deep-linkable:
  // gallery mode gets its own link (?view=gallery), a photo centered in the
  // main view gets ?photo=X, and the fullscreen viewer gets ?photo=X&full=1.
  // replaceState (not pushState) so scrolling/browsing doesn't spam history.
  //
  // Debounced + try/catch'd: browsers rate-limit history.replaceState (Chrome
  // caps it around 100 calls/10s per frame). Holding an arrow key fires OS
  // key-repeat at 20-30/sec, and each one used to call this directly — a few
  // seconds of holding blew past the limit and threw an uncaught exception
  // that crashed the whole app.
  const syncUrlTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncUrl = useCallback(() => {
    if (syncUrlTimeout.current) clearTimeout(syncUrlTimeout.current);
    syncUrlTimeout.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedRef.current) {
        // Fullscreen wins regardless of which mode is underneath it.
        params.set('photo', selectedRef.current.filename);
        params.set('full', '1');
      } else if (modeRef.current === 'grid') {
        params.set('view', 'gallery');
      } else if (focusedIndexRef.current !== null && window.innerWidth >= 640) {
        // Below sm, the main view shows several photos peeking at once (not
        // one dominant photo like desktop), so there's no single "current
        // photo" to link to while just scrolling there.
        params.set('photo', images[focusedIndexRef.current].filename);
      }
      const qs = params.toString();
      try {
        window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
      } catch {
        // Rate-limited or otherwise blocked — the URL just won't update this tick.
      }
    }, 150);
  }, [images]);

  const openImage = useCallback((index: number) => {
    priorityLoad(images[index]);
    preloadAhead(index);
    focusedIndexRef.current = index;
    selectedRef.current = images[index];
    setFocusedIndex(index);
    setSelected(images[index]);
    syncUrl();
  }, [images, priorityLoad, preloadAhead, syncUrl]);

  const close = useCallback(() => {
    selectedRef.current = null;
    setSelected(null);
    syncUrl();
  }, [syncUrl]);

  // Deep link: ?view=gallery opens gallery mode; ?photo=X centers that photo
  // in the main view; ?photo=X&full=1 opens straight into the fullscreen viewer.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'gallery') {
      modeRef.current = 'grid';
      setMode('grid');
      return;
    }
    const filename = params.get('photo');
    if (!filename) return;
    const index = images.findIndex(img => img.filename === filename);
    if (index === -1) return;
    if (params.get('full') === '1') {
      openImage(index);
    } else {
      focusedIndexRef.current = index;
      setFocusedIndex(index);
      scrollInstantly(() => {
        photoRefs.current[index]?.scrollIntoView({ block: window.innerWidth >= 640 ? 'start' : 'center' });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track which photo is actually centered on screen while scrolling in focus
  // mode (mouse wheel/touch, not just keyboard), and keep the URL in sync.
  useEffect(() => {
    if (mode !== 'focus') return;
    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => ratios.set(entry.target, entry.intersectionRatio));
        let bestEl: Element | null = null;
        let bestRatio = 0;
        ratios.forEach((ratio, el) => {
          if (ratio > bestRatio) { bestRatio = ratio; bestEl = el; }
        });
        if (!bestEl) return;
        const idx = photoRefs.current.indexOf(bestEl as HTMLDivElement);
        if (idx !== -1 && idx !== focusedIndexRef.current) {
          focusedIndexRef.current = idx;
          setFocusedIndex(idx);
          syncUrl();
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1] }
    );
    photoRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [mode, syncUrl]);

  // Lock background scroll while the fullscreen viewer is open. overflow:hidden
  // alone doesn't reliably block wheel/touch input in every browser, so pin the
  // body in place at its current scroll offset — a position:fixed element simply
  // can't scroll — and restore the exact position on close.
  useEffect(() => {
    if (!selected) return;
    const scrollY = window.scrollY;
    const { position, top, width, overflow } = document.body.style;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      document.body.style.overflow = overflow;
      scrollInstantly(() => window.scrollTo({ top: scrollY, left: 0 }));
    };
  }, [selected]);

  // Keyboard navigation. Reads/writes refs (not state) so a keydown fired
  // mid-render — e.g. from OS key-repeat while holding j/k — always sees the
  // true latest index instead of a stale closure, which previously caused
  // presses to be dropped or double-applied depending on render timing.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const total = images.length;

      // Modal open: arrows cycle images, Escape closes
      if (selectedRef.current) {
        const idx = images.findIndex(img => img.filename === selectedRef.current!.filename);
        switch (e.key) {
          case 'ArrowLeft': case 'h': case 'ArrowUp': case 'k':
            e.preventDefault();
            if (idx > 0) openImage(idx - 1);
            break;
          case 'ArrowRight': case 'l': case 'ArrowDown': case 'j':
            e.preventDefault();
            if (idx < total - 1) openImage(idx + 1);
            break;
          case 'Escape':
            e.preventDefault();
            close();
            break;
        }
        return;
      }

      // g opens gallery mode, Escape exits it back to focus mode
      if (e.key === 'g') {
        if (modeRef.current !== 'grid') {
          e.preventDefault();
          modeRef.current = 'grid';
          setMode('grid');
          setGridBorderVisible(false);
          syncUrl();
        }
        return;
      }
      if (e.key === 'Escape') {
        if (modeRef.current === 'grid') {
          e.preventDefault();
          modeRef.current = 'focus';
          setMode('focus');
          syncUrl();
        }
        return;
      }

      const current = focusedIndexRef.current ?? -1;

      if (modeRef.current === 'grid') {
        // 2D grid navigation: h/l move by column, j/k move by row
        const cols = window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2;

        const moveTo = (next: number) => {
          const clamped = Math.max(0, Math.min(total - 1, next));
          focusedIndexRef.current = clamped;
          setFocusedIndex(clamped);
          setGridBorderVisible(true);
          // With scroll-snap-type: mandatory active, calling scrollIntoView at
          // all forces a resnap to the target's snap point, even with block:
          // 'nearest' and even when it's already fully on screen. So check
          // visibility ourselves first and only trigger a scroll when the
          // target genuinely isn't fully visible.
          const el = gridRefs.current[clamped];
          if (el) {
            const rect = el.getBoundingClientRect();
            const fullyVisible = rect.top >= 49 && rect.bottom <= window.innerHeight;
            if (!fullyVisible) {
              scrollInstantly(() => el.scrollIntoView({ block: 'nearest' }));
            }
          }
        };

        switch (e.key) {
          case 'ArrowLeft': case 'h':
            e.preventDefault();
            moveTo(current <= 0 ? 0 : current - 1);
            break;
          case 'ArrowRight': case 'l':
            e.preventDefault();
            moveTo(current < 0 ? 0 : current + 1);
            break;
          case 'ArrowUp': case 'k':
            e.preventDefault();
            moveTo(current < 0 ? 0 : current - cols);
            break;
          case 'ArrowDown': case 'j':
            e.preventDefault();
            moveTo(current < 0 ? 0 : current + cols);
            break;
          case 'Enter':
            e.preventDefault();
            if (focusedIndexRef.current !== null) openImage(focusedIndexRef.current);
            break;
        }
        return;
      }

      // Single-column list navigation
      const moveTo = (next: number) => {
        const clamped = Math.max(0, Math.min(total - 1, next));
        focusedIndexRef.current = clamped;
        setFocusedIndex(clamped);
        syncUrl();
        scrollInstantly(() => {
          photoRefs.current[clamped]?.scrollIntoView({ block: window.innerWidth >= 640 ? 'start' : 'center' });
        });
      };

      switch (e.key) {
        case 'ArrowLeft': case 'h': case 'ArrowUp': case 'k':
          e.preventDefault();
          moveTo(current <= 0 ? 0 : current - 1);
          break;
        case 'ArrowRight': case 'l': case 'ArrowDown': case 'j':
          e.preventDefault();
          moveTo(current < 0 ? 0 : current + 1);
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndexRef.current !== null) openImage(focusedIndexRef.current);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images, openImage, close, setMode, syncUrl]);

  const selectedIndex = selected ? images.findIndex(img => img.filename === selected.filename) : -1;

  return (
    <>
      {mode === 'focus' ? (
        <div
          style={viewport && viewport.w < 640 ? { paddingTop: viewport.h * 0.1, paddingBottom: viewport.h * 0.1 } : undefined}
          className="flex flex-col items-center gap-3 sm:gap-10 px-4 sm:px-6 py-[12.5svh] sm:pt-[69px] sm:pb-5"
        >
          {images.map((image, i) => (
            <Photo
              key={i}
              image={image}
              photoRef={el => { photoRefs.current[i] = el; }}
              onClick={() => openImage(i)}
              viewport={viewport}
            />
          ))}
        </div>
      ) : (
        <div className="px-3 md:px-4 pt-[69px] pb-4">
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            style={{ gridAutoRows: viewport ? `${(viewport.h - 93) / 3}px` : 'calc((100svh - 93px) / 3)' }}
          >
            {images.map((image, i) => (
              <GridThumb
                key={image.filename}
                image={image}
                isFocused={gridBorderVisible && focusedIndex === i}
                thumbRef={el => { gridRefs.current[i] = el; }}
                onClick={() => openImage(i)}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          const next = modeRef.current === 'focus' ? 'grid' : 'focus';
          modeRef.current = next;
          setMode(next);
          if (next === 'grid') setGridBorderVisible(false);
          syncUrl();
        }}
        aria-label={mode === 'focus' ? 'Open gallery mode' : 'Close gallery mode'}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-lg text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:scale-105 active:scale-95 transition-transform"
      >
        {mode === 'focus' ? <LayoutGrid size={16} /> : <X size={16} />}
        {mode === 'focus' ? 'Gallery mode' : 'Close'}
      </button>

      {selected && (
        <FullImage
          key={selected.filename}
          image={selected}
          isPreloaded={preloaded.has(selected.filename)}
          onClose={close}
          onLoaded={() => markPreloaded(selected.filename)}
          onPrev={() => selectedIndex > 0 && openImage(selectedIndex - 1)}
          onNext={() => selectedIndex < images.length - 1 && openImage(selectedIndex + 1)}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < images.length - 1}
        />
      )}
    </>
  );
}
