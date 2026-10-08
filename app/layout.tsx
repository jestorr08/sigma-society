import './globals.css';
import type { Metadata } from 'next';
import { Newsreader, Instrument_Sans } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const serif = Newsreader({ subsets: ['latin'], variable: '--serif' });
const sans = Instrument_Sans({ subsets: ['latin'], variable: '--sans' });

export const metadata: Metadata = {
  title: 'SIGMA Society',
  description: 'Statistical Innovation and Growth In Mathematical Advancement Society',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
