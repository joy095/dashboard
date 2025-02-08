/** @format */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assignment: Users & Posts Dashboard in Next.js",
  description:
    "Next.js application that fetches and displays a list of user profiles and, for each user, shows their related posts. This assignment will assess your ability to integrate multiple external APIs, manage state, handle errors, and design a responsive UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="container mx-auto px-6 pt-10">
            <Link href="/">
              <h1 className="text-3xl font-bold">Users Dashboard</h1>
            </Link>
          </div>

          {children}
        </Providers>
      </body>
    </html>
  );
}
