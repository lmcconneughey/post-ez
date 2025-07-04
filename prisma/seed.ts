import { PrismaClient } from '../app/generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding users...');

    const users = [];

    // 1. Create 10 users
    for (let i = 0; i < 10; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const fullName = `${firstName} ${lastName}`;
        const userName =
            `${firstName}.${lastName}${faker.number.int({ min: 10, max: 9999 })}`.toLowerCase();

        const user = await prisma.user.create({
            data: {
                email: faker.internet.email({ firstName, lastName }),
                userName,
                displayName: fullName,
                img: faker.image.avatar(),
                cover: faker.image.urlPicsumPhotos({
                    width: 1200,
                    height: 400,
                }),
                bio: faker.person.bio(),
                location: faker.location.city(),
                job: faker.person.jobTitle(),
                website: faker.internet.url(),
            },
        });

        users.push(user);
    }

    console.log('Seeding posts...');
    // 2. Create 1–3 posts per user
    for (const user of users) {
        const numPosts = faker.number.int({ min: 1, max: 3 });

        for (let i = 0; i < numPosts; i++) {
            await prisma.post.create({
                data: {
                    name: faker.lorem.sentence({ min: 3, max: 6 }),
                    desc: faker.lorem.paragraph({ min: 1, max: 2 }),
                    img: faker.datatype.boolean()
                        ? faker.image.urlPicsumPhotos({
                              width: 600,
                              height: 400,
                          })
                        : null,
                    video: null, // or faker.internet.url() for placeholder
                    isSensitive: faker.datatype.boolean(0.1),
                    userId: user.id,
                },
            });
        }
    }

    console.log('Seeding follows...');

    // 3. Random follows (each user follows 2–5 others)
    for (const follower of users) {
        const followees = faker.helpers
            .shuffle(users.filter((u) => u.id !== follower.id))
            .slice(0, faker.number.int({ min: 2, max: 5 }));

        for (const following of followees) {
            await prisma.follow.create({
                data: {
                    followerId: follower.id,
                    followingId: following.id,
                },
            });
        }
    }

    console.log('Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
