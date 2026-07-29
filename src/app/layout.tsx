import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AmplifyProvider } from "@/components/auth/amplify-provider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Listenly — IELTS Listening Practice",
    template: "%s | Listenly",
  },
  description:
    "Realistic IELTS-style Listening practice, focused feedback, and progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  );
}
