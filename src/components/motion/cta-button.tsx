"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "cn";
import { gsap, useGSAP, HOVER_OK } from "@/lib/gsap";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  /** "down" travels down the page, "right" navigates, "external" leaves the site. */
  icon?: "down" | "right" | "external";
  variant?: "primary" | "ghost";
  magnetic?: boolean;
  className?: string;
};

/**
 * Pill CTA with a nested icon orb and optional magnetic hover (max 6px pull,
 * transform-only, pointer devices without reduced motion). Press = physical scale.
 * Primary is starlight on void: Orbitane's CTAs are light, never colour (docs/03 §1).
 */
export function CtaButton({
  href,
  children,
  icon = "right",
  variant = "primary",
  magnetic = false,
  className,
}: CtaButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Icon = icon === "down" ? ArrowDown : icon === "external" ? ArrowUpRight : ArrowRight;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !magnetic) return;
      const mm = gsap.matchMedia();
      mm.add(HOVER_OK, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
          const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
          xTo(relX * 6);
          yTo(relY * 4);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        };
      });
    },
    { scope: ref },
  );

  const isInternalRoute = href.startsWith("/");
  const isExternal = icon === "external" || /^https?:/.test(href);
  const Comp = isInternalRoute ? Link : "a";

  return (
    <Comp
      ref={ref as never}
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group inline-flex h-12 items-center gap-3 rounded-full pr-1.5 pl-6 text-[15px] font-medium transition-[background-color,border-color,transform] duration-500 ease-[var(--ease-drift)] active:scale-[0.98]",
        variant === "primary"
          ? "bg-starlight text-void hover:bg-core-light"
          : "border border-hairline bg-transparent text-starlight hover:border-starlight/30 hover:bg-surface/60",
        className,
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-full transition-transform duration-500 ease-[var(--ease-drift)] group-hover:scale-105",
          icon === "down" ? "group-hover:translate-y-0.5" : "group-hover:translate-x-0.5 group-hover:-translate-y-px",
          variant === "primary" ? "bg-void/10" : "bg-surface-2",
        )}
      >
        <Icon aria-hidden strokeWidth={1.75} className="size-4" />
      </span>
    </Comp>
  );
}
