import './globals.css';

export const metadata = {
  title: 'Internet Speed Test',
  description: 'Test your internet connection speed with our modern speed test tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
