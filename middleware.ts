import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(
    async (auth, req) => {
        const url = req.nextUrl.pathname;

        const publicRoutes = [
            '/sign-in',
            '/sign-up',
            '/robots.txt',
            '/messages/compose',
        ];

        if (publicRoutes.some((route) => url.startsWith(route))) {
            return;
        }

        await auth();
    },
    {
        signInUrl: '/sign-in',
        signUpUrl: '/sign-up',
    },
);

export const config = {
    matcher: [
        '/((?!_next|.*\\.(?:svg|png|jpg|jpeg|gif|ico|css|js|woff2?|ttf|map|txt)).*)',
        '/(api|trpc)(.*)',
    ],
};
