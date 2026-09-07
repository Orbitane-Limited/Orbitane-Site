import Link from "next/link";
import { footer, site } from "@/content/site";
import { Wordmark } from "@/components/brand/wordmark";
import { Reveal } from "@/components/motion/reveal";

/**
 * Footer (docs/02 §4.6): wordmark, three small columns, one line of company facts
 * when provided. No social icons unless real accounts exist. No decoration.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-hairline bg-[linear-gradient(to_bottom,transparent,var(--void)_45%)] px-5 py-14 md:px-8">
      <Reveal className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]" stagger>
        <div>
          <Wordmark />
          <p className="mt-4 max-w-[36ch] text-sm leading-[1.6] text-starlight-3">{site.description}</p>
        </div>
        {footer.columns.map((col) => (
          <div key={col.title}>
            <p className="telemetry text-starlight-3">{col.title}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {col.links.map((l) =>
                l.href.startsWith("/") ? (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-starlight-2 underline-offset-4 transition-colors hover:text-starlight hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ) : (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-starlight-2 underline-offset-4 transition-colors hover:text-starlight hover:underline">
                      {l.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </Reveal>
      <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col gap-2 border-t border-hairline pt-6 text-xs text-starlight-3 md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {footer.facts ?? site.name}
        </p>
        <p className="telemetry">{site.name} · the orbital system</p>
      </div>
    </footer>
  );
}
