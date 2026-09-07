import { site } from "@/content/site";

/**
 * Proposed wordmark (docs/03 §5): a 10px core dot inside a single orbit ring,
 * then "Orbitane" in Bricolage 600. Replaced by the founder's mark if one exists.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <svg aria-hidden viewBox="0 0 24 24" className="size-6">
        <ellipse cx="12" cy="12" rx="10.5" ry="4.6" transform="rotate(-14 12 12)" fill="none" stroke="var(--starlight)" strokeOpacity="0.55" strokeWidth="1" />
        <circle cx="12" cy="12" r="3" fill="var(--core-light)" />
      </svg>
      <span className="text-[17px] font-semibold tracking-[-0.02em] text-starlight">{site.name}</span>
    </span>
  );
}
