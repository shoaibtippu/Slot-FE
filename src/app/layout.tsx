import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Slot | Online Sports Ground Booking Platform',
  description: 'Book time slots for football turf, padel, cricket, badminton, and sports facilities in real-time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="h-full w-full font-sans bg-white text-gray-900 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
