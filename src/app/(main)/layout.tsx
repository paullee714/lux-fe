"use client";

import { Header, Footer, Sidebar, MobileNav } from "@/components/layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 lg:px-8 py-6">{children}</div>
          <Footer />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
