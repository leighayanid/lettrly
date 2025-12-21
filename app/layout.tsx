import type { Metadata } from "next";
import { Crimson_Text, Caveat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${crimson.variable} ${caveat.variable} font-serif antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
