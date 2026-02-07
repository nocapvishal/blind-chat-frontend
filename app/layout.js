import "./globals.css";
import { Inter, Outfit } from "next/font/google";
import CursorGlow from "./CursorGlow"

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata = {
  title: "Blind Chat in Campus",
  description: "Meet students anonymously",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
