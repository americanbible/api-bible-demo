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
      className={`${ubuntu.className} min-h-full antialiased w-[100vw] `}
      suppressHydrationWarning
    >
      <body className="w-full h-full flex flex-col items-center">
        <div className="max-w-full md:max-w-[800px] flex flex-col border-black border-l-[1px] border-r-[1px] pb-[20vh]">
          <Suspense fallback={<PageLoader />}>
            <Navbar />
            {children}
          </Suspense>
        </div>
      </body>
    </html>
  );
}
