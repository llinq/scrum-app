import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import {
  APP_CONFIG,
  ALL_KEYWORDS,
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
} from "@/lib/metadata";
import { SoftwareApplicationJsonLd } from "@/components/SoftwareApplicationJsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: {
    default: 'Scrum App - Retrospectivas Ágeis em Tempo Real',
    template: '%s | Scrum App',
  },
  description: APP_CONFIG.description,
  keywords: ALL_KEYWORDS,
  authors: [{ name: 'Scrum App Team' }],
  creator: 'Scrum App',
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    title: 'Scrum App - Retrospectivas Ágeis em Tempo Real',
    description: APP_CONFIG.description,
    url: APP_CONFIG.url,
  },
  twitter: {
    ...DEFAULT_TWITTER,
    title: 'Scrum App - Retrospectivas Ágeis',
    description: APP_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'cmL5vK8aLBh8UgrIKDi1I9BQw7bZZ1RbdzNjdB7H7zk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SoftwareApplicationJsonLd />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
