import type { Metadata } from "next";
import { Chango, Hind_Madurai } from "next/font/google";

import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { Container } from "@/components/layout/Container/Container";

import "./globals.css";
import { MswWrapper } from "./msw-wrapper";

const chango = Chango({
  variable: "--font-chango",
  subsets: ["latin"],
  weight: "400",
});

const hindMadurai = Hind_Madurai({
  variable: "--font-hind-madurai",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Burgerz",
  description: "Smash burgers, done right.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${chango.variable} ${hindMadurai.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <MswWrapper>
          <SiteHeader />
          <main className="flex-1 py-8">
            <Container>{children}</Container>
          </main>
          <SiteFooter />
        </MswWrapper>
      </body>
    </html>
  );
}
