import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Blind Chat in Campus",
  description: "Anonymous campus chat for Pondicherry University students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex flex-col min-h-screen">

        {/* PAGE CONTENT */}
        <div className="flex-1">{children}</div>

        {/* LEGAL FOOTER */}
        <footer className="text-xs text-gray-500 border-t border-white/10 p-4 flex flex-wrap justify-center gap-4">
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/guidelines">Guidelines</Link>
          <span>© Blind Chat</span>
        </footer>

      </body>
    </html>
  );
}
