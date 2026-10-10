import './globals.css';
import type { Metadata } from 'next';
import { Newsreader, Instrument_Sans, Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const serif = Newsreader({ subsets: ['latin'], variable: '--serif' });
const sans = Instrument_Sans({ subsets: ['latin'], variable: '--sans' });
const display = Poppins({ subsets: ['latin'], weight: ['700'], variable: '--display' });

export const metadata: Metadata = {
  title: 'SIGMA Society',
  description: 'Statistical Innovation and Growth In Mathematical Advancement Society',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
   <html lang="en" data-theme="dark" suppressHydrationWarning>
  <head>
    <script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.theme=localStorage.getItem('theme')==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}" }} />
  </head>
  <body className={`${serif.variable} ${sans.variable} ${display.variable}`}>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </body>
</html>
  );
}
