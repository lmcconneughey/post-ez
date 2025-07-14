import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import { prisma } from '../../../../db/prisma';

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);

        // Do something with payload
        // For this guide, log payload to console
        const { id } = evt.data;
        const eventType = evt.type;
        console.log(
            `Received webhook with ID ${id} and event type of ${eventType}`,
        );
        console.log('Webhook payload:', evt.data);
        if (eventType === 'user.created') {
            const { id, username, email_addresses } = evt.data;
            const email = email_addresses[0]?.email_address;
            await prisma.user.create({
                data: {
                    id,
                    userName: username as string,
                    email,
                },
            });
            console.log(`User created: ${username} (${id})`);
        }
        if (eventType === 'user.deleted') {
            const { id } = evt.data;

            await prisma.user.delete({
                where: {
                    id,
                },
            });
            console.log(`User deleted: (${id})`);
        }

        return new Response('Webhook received', { status: 200 });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error verifying webhook', { status: 400 });
    }
}
