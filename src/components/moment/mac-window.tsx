import type { ReactNode } from "react";
import { cn } from "cn";

/**
 * A small Mac window frame for the working moment (docs/02 §4.2). Double bezel:
 * 28px outer tray, 20px inner window (docs/03 §4). Hairlines, no shadows;
 * depth comes from the lit body's glow behind it.
 */
export function MacWindow({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[var(--radius-bezel)] border border-hairline bg-starlight/[0.04] p-2", className)}>
      <div className="overflow-hidden rounded-[var(--radius-panel)] border border-hairline bg-surface">
        <div className="flex h-9 items-center gap-2 border-b border-hairline bg-surface-2 px-3.5">
          <span aria-hidden className="size-2.5 rounded-full bg-starlight/20" />
          <span aria-hidden className="size-2.5 rounded-full bg-starlight/20" />
          <span aria-hidden className="size-2.5 rounded-full bg-starlight/20" />
          <span className="ml-2 text-xs font-medium text-starlight-2">{title}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
