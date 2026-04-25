import type { Metadata } from "next";
import "./globals.css";
import PhoneWrapper from "@/components/PhoneWrapper";

export const metadata: Metadata = {
  title: "흙수저 탈출 2015",
  description: "2015년 감성 자산 증식 시뮬레이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex items-center justify-center bg-zinc-950">
        <PhoneWrapper>
          {children}
        </PhoneWrapper>
      </body>
    </html>
  );
}
