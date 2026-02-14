import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Bookmark App",
  description: "Save and manage your bookmarks easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
