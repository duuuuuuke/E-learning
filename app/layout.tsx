import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { ConfettiProvider } from "@/components/providers/ConfettiProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "E-learning",
    description: "Online learning platform"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ConfettiProvider />
                    <Toaster />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
