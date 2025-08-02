import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(
    async (auth, req) => {
        const url = req.nextUrl.pathname;

        const publicRoutes = ['/sign-in', '/sign-up'];
        if (publicRoutes.includes(url)) return;

        await auth.protect();
    },
    {
        signInUrl: '/sign-in',
        signUpUrl: '/sign-up',
    },
);

export const config = {
    matcher: [
        '/((?!_next|.*\\.(?:svg|png|jpg|jpeg|gif|ico|css|js|woff2?|ttf|map)).*)',
        '/(api|trpc)(.*)',
    ],
};
