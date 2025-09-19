import type { Metadata } from 'next';
import './globals.css';
import { MainLayout } from '@/components/main-layout';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from '@/components/session-provider';

export const metadata: Metadata = {
  title: 'GuardianAI Attendance',
  description: 'A full working AI attendance system by Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SessionProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
