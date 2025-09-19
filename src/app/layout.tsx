import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Comparsa Moreno Polo - La Junquillera 2025",
  description: "Aplicación oficial de la Comparsa Moreno Polo de Marbella. Gestión de repertorio musical, calendario de eventos y organización para la temporada de carnaval 2025.",
  keywords: "Comparsa Moreno Polo, Marbella, Carnaval 2025, La Junquillera, música, repertorio, eventos",
  authors: [{ name: "Comparsa Moreno Polo" }],
  creator: "Comparsa Moreno Polo",
  publisher: "Comparsa Moreno Polo",
  metadataBase: new URL('https://comparsamorenopolo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Comparsa Moreno Polo - La Junquillera 2025",
    description: "Aplicación oficial de la Comparsa Moreno Polo de Marbella. Gestión de repertorio musical, calendario de eventos y organización para la temporada de carnaval 2025.",
    url: 'https://comparsamorenopolo.com',
    siteName: 'Comparsa Moreno Polo',
    images: [
      {
        url: '/images/carnaval-logo.png',
        width: 1200,
        height: 630,
        alt: 'Comparsa Moreno Polo - La Junquillera 2025',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Comparsa Moreno Polo - La Junquillera 2025",
    description: "Aplicación oficial de la Comparsa Moreno Polo de Marbella para la temporada de carnaval 2025.",
    images: ['/images/carnaval-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Moreno Polo" />
        <link rel="apple-touch-icon" href="/images/carnaval-logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
