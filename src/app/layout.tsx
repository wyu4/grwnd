import { Lexend, Open_Sans, Source_Code_Pro } from "next/font/google";
import "./css/globals.css";
import { Metadata } from "next";
import { createPageMetadata } from "@/utils/metadata-helpers";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-lexend",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-open-sans",
});

const code = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-code",
});

export const metadata = createPageMetadata(undefined);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${lexend.variable} ${openSans.variable} ${code.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
