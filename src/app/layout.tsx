import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Noto_Sans_JP, JetBrains_Mono, Shippori_Mincho } from 'next/font/google';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const shipporiMincho = Shippori_Mincho({
  weight: ['500', '700'],
  subsets: ['latin'],
  variable: '--font-shippori-mincho',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '和語ノート — Sổ tay từ vựng',
  description: 'Sổ tay học chữ cái & từ vựng tiếng Nhật thông minh tích hợp Supabase và tra từ tự động',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${notoSansJP.variable} ${jetbrainsMono.variable} ${shipporiMincho.variable}`}>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
