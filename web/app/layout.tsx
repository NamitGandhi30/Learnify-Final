import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ClerkProvider>
                    {/* <StreamVideoProvider> */}
                        <ConfettiProvider />
                        <ToastProvider />
                        {children}
                    {/* </StreamVideoProvider> */}
                </ClerkProvider>
            </body>
        </html>
    );
}
