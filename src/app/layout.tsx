import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "CrazySMP — Store",
  description: "Official CrazySMP Store — Ranks, Keys, and more.",
};

// Disable zoom: user-scalable=no, maximum-scale=1, viewport-fit=cover
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Minecraft font is now self-hosted (see globals.css @font-face) — was fonts.cdnfonts.com */}
        {/* Space Grotesk — geometric sans-serif for price numbers (modern, clean numerals) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Pixelify+Sans:wght@400;500;600;700&display=swap" />
      </head>
      <body
        className="antialiased bg-background text-foreground"
        style={{
          // Disable pinch-zoom on touch + remove double-tap-to-zoom delay
          touchAction: "manipulation",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
          // Use Minecraft font as default everywhere
          fontFamily: "'Minecraft', 'Inter', monospace",
        }}
      >
        {/* Disable ctrl+wheel zoom via inline script (runs before React hydration) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.addEventListener('wheel', function(e) {
                  if (e.ctrlKey) e.preventDefault();
                }, { passive: false });
                document.addEventListener('keydown', function(e) {
                  if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '-' || e.key === '0' || e.key === '+')) {
                    e.preventDefault();
                  }
                }, { passive: false });
                // Disable pinch gesture on touch devices
                document.addEventListener('gesturestart', function(e) {
                  e.preventDefault();
                }, { passive: false });
                document.addEventListener('gesturechange', function(e) {
                  e.preventDefault();
                }, { passive: false });
                document.addEventListener('gestureend', function(e) {
                  e.preventDefault();
                }, { passive: false });
              })();
            `,
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
