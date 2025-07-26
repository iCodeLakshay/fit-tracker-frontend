import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FitTracker - Gym Progress Tracking App',
  description: 'Track your gym workouts, monitor progress, calculate BMI, and visualize your fitness journey with detailed reports and analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/favicon" href="/logo/logo-black.svg" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
        <Analytics/>
      </body>
    </html>
  );
}