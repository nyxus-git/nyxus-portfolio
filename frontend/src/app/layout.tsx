import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { CursorSpotlight } from "@/components/ui/CursorSpotlight";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rohan Mane | AI Engineer & ML Researcher",
  description:
    "Portfolio of Rohan Mane — AI Engineer, ML Researcher, and Full Stack Developer. Building intelligent systems with Python, PyTorch, TensorFlow, and modern web technologies.",
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "Deep Learning",
    "Portfolio",
    "Rohan Mane",
    "Python",
    "PyTorch",
    "TensorFlow",
    "Full Stack Developer",
    "Open Source",
  ],
  authors: [{ name: "Rohan Mane" }],
  creator: "Rohan Mane",
  openGraph: {
    title: "Rohan Mane | AI Engineer",
    description: "Building intelligent systems and contributing to impactful open source AI projects.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Mane | AI Engineer",
    description: "Building intelligent systems and contributing to impactful open source AI projects.",
    creator: "@NyxusXplore",
  },
  robots: { index: true, follow: true },
};


import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { PageLoader } from "@/components/ui/PageLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageLoader />
        <CustomCursor />
        <CursorSpotlight />
        <ScrollProgress />
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}

