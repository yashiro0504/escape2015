import type { Metadata, Viewport } from "next";
import "./globals.css";
import PhoneWrapper from "@/components/PhoneWrapper";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: "흙수저 탈출 2015",
  description: "2015년 감성 자산 증식 시뮬레이션",
  manifest: "manifest.json",
  icons: {
    apple: "icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "흙수저탈출",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-zinc-950">
        <PhoneWrapper>
          {children}
        </PhoneWrapper>
      </body>
    </html>
  );
}
