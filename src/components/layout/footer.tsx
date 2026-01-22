import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "About", href: "/about" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="px-6 lg:px-8 flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
            <span className="text-sm font-bold text-primary-foreground">L</span>
          </div>
          <span className="text-sm text-muted-foreground">
            &copy; {currentYear} Lux. All rights reserved.
          </span>
        </div>

        <nav className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
