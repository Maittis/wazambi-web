import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  highlight?: string;
  subline?: string;
  tone?: "light" | "dark";
};

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  subline,
  tone = "light",
}: SectionHeadingProps) {
  const isLight = tone === "light";
  return (
    <div className="mx-auto max-w-[830px] px-2.5 text-center">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h2
          className={`mt-3 headline text-[26px] md:text-[38px] ${
            isLight ? "text-navy" : "text-white"
          }`}
        >
          {highlight ? (
            <>
              {title.replace(highlight, "")}
              <span className={isLight ? "text-wazambi-gold-deep" : "text-wazambi-gold"}>
                {highlight}
              </span>
              {title.slice(title.indexOf(highlight) + highlight.length)}
            </>
          ) : (
            title
          )}
        </h2>
        {subline && (
          <p
            className={`mx-auto mt-4 max-w-[640px] text-[15px] font-light leading-relaxed md:text-[17px] ${
              isLight ? "text-ink/70" : "text-white/75"
            }`}
          >
            {subline}
          </p>
        )}
      </Reveal>
    </div>
  );
}