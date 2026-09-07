/**
 * ALL page copy, typed (docs/02 §4). Components receive strings; nothing
 * user-visible is hard-coded. Copy is a working draft until locked per section.
 * Honesty walls and banned vocabulary: docs/02 §6.
 */

export const site = {
  name: "Orbitane",
  legalName: "Orbitane Limited",
  url: "https://orbitane.com",
  title: "Orbitane · Products in motion",
  description:
    "Orbitane is a product house building AI/ML products and native macOS software. The first body in orbit is Hemta.",
};

export const nav = {
  contact: { label: "Contact", href: "#contact" },
  indexLabel: "Orbit index",
};

export const approach = {
  headline: "Products in motion.",
  sub: "Orbitane is a product house building AI/ML products and native macOS software. The first body in orbit is Hemta.",
  primary: { label: "See Orbit 01", href: "#hemta" },
  secondary: { label: "Hand us a problem", href: "#contact" },
};

export const inMotion = {
  id: "in-motion",
  headline: "More bodies in motion.",
  body: "New products are in development. We name them when they ship.",
};

export const howWeWork = {
  id: "how-we-work",
  headline: "Your problem becomes ours.",
  intro:
    "Clients hand us a problem. From that moment it is ours until it is solved. We build AI/ML products and native macOS software, and we work the same way on both.",
  steps: [
    {
      name: "Discovery",
      line: "We learn the problem and the people behind it before we propose anything.",
    },
    {
      name: "Contract",
      line: "Design decisions are documented before build. You see the plan, and it is the contract.",
    },
    {
      name: "Build",
      line: "Section by section, verified in a real browser, performance-gated.",
    },
    {
      name: "Ownership",
      line: "We stay until it is solved, then hand over something you can run without us.",
    },
  ],
};

export const values = {
  id: "values",
  statements: [
    { headline: "We own the requirement.", line: "Ownership, not order-taking." },
    {
      headline: "We care about the people behind it.",
      line: "Every requirement has someone waiting on the other side of it.",
    },
  ],
};

export const contact = {
  id: "contact",
  headline: "Hand us a problem.",
  line: "Tell us what you need built. We reply personally.",
  /** Real address (founder, 2026-09-07). Null would render no mailto. */
  email: "orbitane.ltd@gmail.com" as string | null,
  cta: "Email us",
};

export const footer = {
  columns: [
    { title: "Products", links: [{ label: "Hemta", href: "#hemta" }] },
    {
      title: "Company",
      links: [
        { label: "How we work", href: "#how-we-work" },
        { label: "Contact", href: "#contact" },
      ],
    },
    { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }] },
  ],
  /** Legal name (founder, 2026-09-07). Location can be appended when wanted. */
  facts: "Orbitane Limited" as string | null,
};
