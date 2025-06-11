import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NaverBlog Pro - 네이버 블로그 자동화의 새로운 기준",
  description:
    "GPT 연동, 다중 계정, SEO 최적화까지 한 번에! 네이버 블로그 자동화의 모든 것.",
  openGraph: {
    title: "NaverBlog Pro - 네이버 블로그 자동화의 새로운 기준",
    description:
      "GPT 연동, 다중 계정, SEO 최적화까지 한 번에! 네이버 블로그 자동화의 모든 것.",
    images: [
      {
        url: "/NaverBlogPro -logo-main.png",
        width: 1200,
        height: 630,
        alt: "NaverBlog Pro Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
