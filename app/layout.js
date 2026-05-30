import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'LuxeStore | Premium E-Commerce',
  description: 'A modern, premium online shopping experience.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="container" style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem 1.5rem' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
