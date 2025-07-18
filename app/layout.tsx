import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';
import QueryProvider from '../providers/query-provider';

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
            <QueryProvider>
                <html lang='en'>
                    <body>{children}</body>
                </html>
            </QueryProvider>
        </ClerkProvider>
    );
}
