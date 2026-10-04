"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, Users, FileText } from "lucide-react";

export function AppNavigationShell() {
  const pathname = usePathname();

  // Hide global navigation on the full-screen video counselling call and clean onboarding screen
  if (pathname === "/counselling" || pathname === "/onboarding") {
    return null;
  }

  const navItems = [
    {
      href: "/my-path",
      labelEn: "My Path",
      labelHi: "माय पाथ",
      icon: Compass,
    },
    {
      href: "/counselling",
      labelEn: "Saathi Call",
      labelHi: "साथी कॉल",
      icon: Sparkles,
      highlight: true,
    },
    {
      href: "/family",
      labelEn: "Family",
      labelHi: "परिवार",
      icon: Users,
    },
    {
      href: "/applications",
      labelEn: "Docs & Apply",
      labelHi: "दस्तावेज",
      icon: FileText,
    },
    {
      href: "/profile",
      labelEn: "Profile",
      labelHi: "प्रोफाइल",
      icon: Users,
    },
  ];

  return (
    <>
      {/* Desktop Top Header Navigation */}
      <header className="hidden md:flex sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md px-6 py-3 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            CS
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-foreground block leading-none">
              CareerSaathi
            </span>
            <span className="text-[10px] text-muted-foreground block font-medium">
              करियर साथी · वोकेशनल गाइड
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : item.highlight
                    ? "text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.labelEn}</span>
              </Link>
            );
          })}
        </nav>

        {/* User state indicator */}
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
              pathname === "/profile"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted text-foreground"
            }`}
          >
            Profile & Settings / सेटिंग्स
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Thumb-Friendly Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border px-3 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition ${
                isActive
                  ? "text-primary font-bold"
                  : item.highlight
                  ? "text-primary/90 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : item.highlight
                    ? "bg-primary/5 text-primary"
                    : ""
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {item.labelEn}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
