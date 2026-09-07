import { site } from "@/content/site";

/**
 * The Ring (docs/03 §5): Orbitane's mark. One smooth torus seen at a tilt, drawn as an
 * elliptical ring whose front edge is heavier than its back edge. It is the unknot: Hemta's
 * icon is a knotted ring, so the parent mark is the plain ring the knots are tied from.
 * Vector geometry traced from public/brand/ring-mark-flat.png; renders in currentColor.
 */
export function RingMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="-112 -66 224 132"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g transform="rotate(-21)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M -100 0 a 100 40 0 1 0 200 0 a 100 40 0 1 0 -200 0 Z M -87.5 -6.5 a 83.5 23.5 0 1 0 167 0 a 83.5 23.5 0 1 0 -167 0 Z"
        />
      </g>
    </svg>
  );
}

/** Mark + name, used in the nav and footer. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <RingMark className="h-[18px] w-auto text-starlight" />
      <span className="text-[17px] font-semibold tracking-[-0.02em] text-starlight">{site.name}</span>
    </span>
  );
}
