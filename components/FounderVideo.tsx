"use client";

import { useRef, useState } from "react";

export default function FounderVideo({ url, poster }: { url: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative w-full overflow-hidden rounded-[20px] bg-black shadow-2xl ring-1 ring-wazambi-gold/40">
      <video
        ref={ref}
        src={url}
        poster={poster}
        controls
        playsInline
        preload="none"
        className="aspect-video w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && (
        <button
          type="button"
          aria-label="Play the welcome video"
          onClick={() => ref.current?.play()}
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy/30"
        >
          <span className="pointer-events-auto flex h-20 w-20 items-center justify-center rounded-full bg-wazambi-gold text-navy shadow-xl transition-transform hover:scale-105 md:h-24 md:w-24">
            <svg className="ml-1 h-8 w-8 md:h-9 md:w-9" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.3 2.84A1.5 1.5 0 008.3 4.1l10 5.9a1.5 1.5 0 010 2.6l-10 5.9a1.5 1.5 0 01-2.3-1.3V3.74a1.5 1.5 0 01.3-.9z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}