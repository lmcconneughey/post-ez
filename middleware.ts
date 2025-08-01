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
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
