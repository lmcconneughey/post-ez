import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(
    async (auth, req) => {
        const url = req.nextUrl.pathname;

        const publicRoutes = ['/sign-in', '/sign-up', '/robots.txt'];

        if (publicRoutes.some((route) => url.startsWith(route))) {
            return;
        }

        const session = await auth();

        // In dev
        if (!session?.userId && process.env.NODE_ENV === 'development') {
            console.warn('No user session in dev at:', url);
        }

        if (!session?.userId && process.env.NODE_ENV === 'production') {
            return Response.redirect(new URL('/sign-in', req.url));
        }
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
