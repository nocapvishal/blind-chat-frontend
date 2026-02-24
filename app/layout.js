import Script from "next/script";
import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import MixpanelInit from "./components/MixpanelInit";
import Footer from "./components/Footer";

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

        {/* Page Transition */}
        <div className="flex-1 animate-pageFade transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
          {children}
        </div>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}