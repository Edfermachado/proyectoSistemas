import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniEvents | Your Campus, Your Pulse",
  description: "The premier event ticketing platform built exclusively for the university community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;600;700;900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        style={{
          "--font-inter": "'Inter', sans-serif",
          "--font-montserrat": "'Montserrat', sans-serif",
        } as React.CSSProperties}
        className="bg-background text-on-surface font-body-md selection:bg-academic-gold selection:text-university-blue antialiased"
      >
        {children}
      </body>
    </html>
  );
}
