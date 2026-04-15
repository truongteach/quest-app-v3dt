
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { LanguageProvider } from '@/context/language-context';
import { SettingsProvider } from '@/context/settings-context';
import { ThemeColorManager } from '@/components/ThemeColorManager';

export const metadata: Metadata = {
  metadataBase: new URL('https://quest-dntrng.vercel.app'),
  title: {
    default: 'DNTRNG — Precision Assessment Platform',
    template: '%s | DNTRNG'
  },
  description: 'A premium interactive assessment and data platform powered by Google Sheets. Take quizzes and discover insights instantly.',
  keywords: ['assessment', 'quiz', 'google sheets', 'education', 'testing'],
  authors: [{ name: 'DNTRNG Team' }],
  creator: 'DNTRNG',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://quest-dntrng.vercel.app',
    siteName: 'DNTRNG',
    title: 'DNTRNG — Precision Assessment Platform',
    description: 'Transform Google Sheets into interactive assessments.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'DNTRNG Platform'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNTRNG — Precision Assessment Platform',
    description: 'Transform Google Sheets into interactive assessments.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  }
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <SettingsProvider>
          <ThemeColorManager />
          <LanguageProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
