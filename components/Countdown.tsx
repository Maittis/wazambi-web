"use client";

import { useEffect, useState } from "react";

const CLOSE_DATE = new Date("2026-09-20T23:59:59");

function diff() {
  const now = new Date();
  const target = CLOSE_DATE;
  const ms = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Countdown() {
  const [t, setT] = useState(diff());

  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: "Days", value: t.days },
    { label: "Hrs", value: t.hours },
    { label: "Min", value: t.minutes },
    { label: "Sec", value: t.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex w-[74px] flex-col items-center rounded-xl bg-navy py-4 text-white">
          <span className="font-poppins text-[28px] font-bold leading-none text-gold">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide">{item.label}</span>
        </div>
      ))}
    </div>
  );
}