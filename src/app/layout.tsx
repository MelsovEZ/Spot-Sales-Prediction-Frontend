import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "I'M's Sales Analytics Dashboard",
  description: 'Forecasting future demand for products',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100 min-h-screen font-semibold text-gray-900 font-[Helvetica,Arial,sans-serif]">
        {children}
      </body>
    </html>
  );
}
