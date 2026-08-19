import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Dev Toolbox Agent Demo',
  description: 'Agentic requirement-to-deployment demo',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
