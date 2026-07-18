import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl, withBasePath } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Experience Caffeine — Coffee, calibrated",
    template: "%s · Experience Caffeine",
  },
  description:
    "Understand your coffee, calibrate your grinder, and brew with guided recipes built around your equipment.",
  applicationName: "Experience Caffeine",
  keywords: [
    "coffee education",
    "brew guide",
    "grinder settings",
    "coffee recipes",
    "V60",
  ],
  icons: {
    icon: withBasePath("/brand-mark.svg"),
  },
  openGraph: {
    type: "website",
    siteName: "Experience Caffeine",
    title: "Experience Caffeine — Coffee, calibrated",
    description:
      "A modern coffee lab for beans, grinders, recipes, technique, and better tasting brews.",
  },
  twitter: {
    card: "summary",
    title: "Experience Caffeine — Coffee, calibrated",
    description:
      "Learn the variables. Follow the method. Improve the cup.",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#090705",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <a
            href="#main-content"
            className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-amber px-4 py-2 text-sm font-semibold text-[#160e08] focus:translate-y-0"
          >
            Skip to content
          </a>
          <SiteHeader />
          <div id="main-content" tabIndex={-1}>{children}</div>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
