import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/theme-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'I4You',
  description: 'A dating app',
  generator: 'Next.js',
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
    <head>
      <title>I4You</title>
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/icons/icon-192x192.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png" />
      <meta name="theme-color" content="#e91e63" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="I4You" />
    </head>
    <body className={inter.className}>
    <ThemeProvider>
      <div className={'transition-colors duration-1000'}>
        {children}
      </div>
    </ThemeProvider>
    </body>
    </html>
  );
}
