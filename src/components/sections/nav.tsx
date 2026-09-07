import Link from "next/link";
import { nav, site } from "@/content/site";
import { Wordmark } from "@/components/brand/wordmark";
import { OrbitIndex } from "@/components/system/orbit-index";

/**
 * The island (docs/02 §4.0): a floating 56px pill. Wordmark left, the orbit index
 * centre, one Contact pill right. The only translucent element on the site.
 */
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
      <div className="flex h-14 w-full max-w-3xl items-center justify-between gap-2 rounded-full border border-hairline bg-surface/70 px-2 backdrop-blur-md">
        <Link href="/" aria-label={`${site.name} home`} className="flex items-center gap-2.5 rounded-full px-3 py-2">
          <Wordmark />
        </Link>

        <OrbitIndex />

        <a
          href={nav.contact.href}
          className="inline-flex h-10 items-center rounded-full bg-starlight px-4.5 text-sm font-medium text-void transition-colors duration-500 ease-[var(--ease-drift)] hover:bg-core-light"
        >
          {nav.contact.label}
        </a>
      </div>
    </header>
  );
}
