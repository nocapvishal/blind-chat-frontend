import Script from "next/script";
import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import MixpanelInit from "@/components/MixpanelInit";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Blind Chat in Campus",
  description: "Anonymous campus chat for Pondicherry University students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen antialiased`}
      >
        {/* Global Depth Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white/40 to-transparent dark:from-black/40 blur-3xl opacity-40 pointer-events-none" />

        {/* Mixpanel */}
        <MixpanelInit />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-80LJLPY7JD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-80LJLPY7JD');
          `}
        </Script>

        {/* Page Transition Wrapper */}
        <div className="flex-1 animate-pageFade transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
          {children}
        </div>

        {/* Premium Footer */}
        <footer className="text-xs border-t border-black/5 dark:border-white/10 py-6 flex flex-wrap justify-center gap-6 opacity-50 backdrop-blur-xl bg-white/40 dark:bg-black/40">
          <Link href="/legal/terms" className="hover:opacity-80 transition">
            Terms
          </Link>
          <Link href="/legal/privacy" className="hover:opacity-80 transition">
            Privacy
          </Link>
          <Link href="/legal/guidelines" className="hover:opacity-80 transition">
            Guidelines
          </Link>
          <span>© Blind Chat</span>
        </footer>
      </body>
    </html>
  );
}