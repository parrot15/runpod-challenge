import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from '@/components/Navbar';
import NotificationProvider from '@/components/NotificationProvider';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 justify-center`}>
        <NavBar />
        {children}
        <NotificationProvider />
      </body>
    </html>
  );
}
