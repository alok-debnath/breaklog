import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ThemeProvider } from '@/components/theme-provider';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BreakLog v4',
  description:
    'A place to log your work activities for better time management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang='en' suppressHydrationWarning>
      <body className="">
        {/* Providers is a Client Component, so it’s the only place
            you use SessionProvider / React Context */}
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
