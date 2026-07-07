import React from 'react';
import './styles.css';

export const metadata = {
  title: 'UniEvents | Your Campus, Your Pulse',
  description: 'The premier event ticketing platform built exclusively for the university community.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="scroll-smooth" lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface font-body-md selection:bg-academic-gold selection:text-university-blue">
        <main>{children}</main>
      </body>
    </html>
  );
}
