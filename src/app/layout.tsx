// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
  const umamiSrc = process.env.UMAMI_SRC;
  const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;

  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
        {/* <Analytics />
        <SpeedInsights /> */}
      </body>
      {umamiSrc && umamiWebsiteId && (
        <Script async src={umamiSrc} data-website-id={umamiWebsiteId} />
      )}
    </html>
  );
}
