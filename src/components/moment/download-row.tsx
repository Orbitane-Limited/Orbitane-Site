import { FileArchive, Wifi, WifiOff } from "lucide-react";
import { cn } from "cn";

export type DownloadState = "downloading" | "recovering" | "completed";

/** Hemta's real lifecycle states and their colours (docs/03 §2.4). */
const CHIP: Record<DownloadState, { label: string; className: string }> = {
  downloading: { label: "Downloading", className: "bg-body-hemta/25 text-body-hemta-light" },
  recovering: { label: "Recovering", className: "bg-state-recovering/20 text-[#F0A94B]" },
  completed: { label: "Completed", className: "bg-state-completed/20 text-[#5BD48E]" },
};

/**
 * One download inside the moment window. Presentational; the flyby timeline
 * drives the [data-*] hooks (progress scaleX, chip visibility, speed and bytes text,
 * Wi-Fi glyphs). Every value is illustrative demo data, never a claim.
 */
export function DownloadRow({
  file,
  size,
  speed,
  progress,
  initial,
}: {
  file: string;
  size: string;
  speed: string;
  /** 0..1, rendered as the resting state before the timeline takes over. */
  progress: number;
  initial: DownloadState;
}) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-3">
        <FileArchive aria-hidden strokeWidth={1.5} className="size-5 shrink-0 text-starlight-3" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-[13px] font-medium text-starlight">{file}</p>
            <span className="relative h-5 w-24">
              {(Object.keys(CHIP) as DownloadState[]).map((state) => (
                <span
                  key={state}
                  data-chip={state}
                  className={cn(
                    "absolute inset-y-0 right-0 inline-flex items-center rounded-full px-2 text-[11px] font-medium whitespace-nowrap",
                    CHIP[state].className,
                    state === initial ? "" : "invisible opacity-0",
                  )}
                >
                  {CHIP[state].label}
                </span>
              ))}
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-3 font-mono text-[11px] tabular-nums text-starlight-3">
            <span data-bytes>
              {(progress * parseFloat(size)).toFixed(1)} GB of {size}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="relative inline-flex size-3.5 items-center justify-center">
                <Wifi data-wifi="on" aria-hidden strokeWidth={1.75} className="absolute size-3.5" />
                <WifiOff
                  data-wifi="off"
                  aria-hidden
                  strokeWidth={1.75}
                  className="invisible absolute size-3.5 text-[#F0A94B] opacity-0"
                />
              </span>
              <span data-speed>{speed}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-starlight/10">
        <div
          data-progress
          className="h-full origin-left rounded-full bg-body-hemta"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
