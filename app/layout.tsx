
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Sommelier - Imperial Wine Scanner",
  description: "Advanced wine scanner and digital sommelier identifying wine labels with deep viticultural insights.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-ruby-radial">{children}</body>
    </html>
  );
}
