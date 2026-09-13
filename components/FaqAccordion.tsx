"use client";

import { useState } from "react";

type FaqAccordionProps = {
  items: { question: string; answer: string }[];
  section?: string;
  defaultOpen?: boolean;
};

export default function FaqAccordion({
  items,
  section = "faq",
  defaultOpen = false,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen ? 0 : null);

  return (
    <div className="mx-auto max-w-[900px]">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const id = `${section}-${i}`;
        return (
          <div key={id} className="border-b border-dashed border-ink/20">
            <p
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-controls={`${id}-panel`}
              id={`${id}-button`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenIndex(isOpen ? null : i);
                }
              }}
              className="flex cursor-pointer items-center justify-between py-5 pr-6 text-[18px] font-bold text-navy md:text-[22px]"
            >
              {item.question}
              <svg
                className={`ml-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </p>
            <div
              id={`${id}-panel`}
              role="region"
              aria-labelledby={`${id}-button`}
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isOpen ? "600px" : "0px" }}
            >
              <p className="pb-6 pr-12 text-[15px] font-normal leading-[1.65] text-ink/80 md:text-[17px]">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}