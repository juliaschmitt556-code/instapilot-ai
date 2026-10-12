import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InstaPilot AI — Instagram operations, with a human in the loop',
  description: 'A calm command center for Instagram ads, comments, and AI-assisted replies.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
