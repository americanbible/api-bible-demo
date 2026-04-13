import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/NavBar";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "API.Bible Demo",
  description: "API.Bible NextJS Demo Application",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

/**
 * Global layout for the application. Renders the Navbar
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ubuntu.className} h-full antialiased max-w-[100vw]`}
      suppressHydrationWarning
    >
      <body className="w-full min-h-full flex flex-col gap-4 p-4 sm:p-8">
        <Suspense fallback={<PageLoader />}>
          <Navbar />
          {children}
        </Suspense>
      </body>
    </html>
  );
}
