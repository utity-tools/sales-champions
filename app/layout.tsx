import type { Metadata } from 'next';
import { Exo_2, Rajdhani, DM_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-exo2',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
});

export const metadata: Metadata = {
  title: 'Sales Arena — Dashboard',
  description: 'Gamified sales dashboard for high-performance teams',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${exo2.variable} ${rajdhani.variable} ${dmMono.variable}`}
      style={{ fontFamily: 'var(--font-exo2), sans-serif' }}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
