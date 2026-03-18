import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "../components/MainLayout";
import Script from "next/script";
import { TelegramProvider } from "../components/TelegramProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FoodSave",
    description: "Save food, save money, save the planet.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <Script 
                    src="https://telegram.org/js/telegram-web-app.js" 
                    strategy="beforeInteractive" 
                />
            </head>
            <body className={`${inter.className} pt-16`}>
                <TelegramProvider>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </TelegramProvider>
            </body>
        </html>
    );
}
