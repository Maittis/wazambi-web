"use client";

import { useEffect, useState } from "react";
import { stats as defaultStats, faqs as defaultFaqs } from "@/lib/content";

export type ContentOverrides = {
  announcement: { badge?: string; text: string; link: string } | null;
  stats: typeof defaultStats | null;
  faqs: typeof defaultFaqs | null;
};

const defaults: ContentOverrides = {
  announcement: null,
  stats: null,
  faqs: null,
};

export function useContent() {
  const [content, setContent] = useState<ContentOverrides>(defaults);

  useEffect(() => {
    let active = true;
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        setContent({
          announcement: d.announcement ?? null,
          stats: d.stats ?? null,
          faqs: d.faqs ?? null,
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return content;
}