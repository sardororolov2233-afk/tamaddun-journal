import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LanguageProvider } from "../context/LanguageContext";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";


export const metadata: Metadata = {
  title: "Tamaddun",
  description: "Tamaddun — Respublika ilmiy-amaliy konferensiyasi. Materiallar to‘plami oyiga ikki marta elektron shaklda, ochiq kirishda chop etiladi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className="h-full antialiased"
    >
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <LanguageProvider>
          <Navbar />
          
          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
