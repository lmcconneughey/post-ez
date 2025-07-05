import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'post-ez',
    description: 'passion project social media platform',
};

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body>{children}</body>
            </html>
        </ClerkProvider>
    );
}
