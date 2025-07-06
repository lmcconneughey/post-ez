import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding users...');

    const users = [];
    for (let i = 1; i <= 5; i++) {
        const user = await prisma.user.create({
            data: {
                id: `user${i}`,
                email: `user${i}@example.com`,
                userName: `user${i}`,
                displayName: `User ${i}`,
                bio: `Hi I'm user${i}. Welcome to my profile!`,
                location: `USA`,
                job: `Developer`,
                website: `google.com`,
            },
        });
        users.push(user);
    }
    console.log(`${users.length} users created.`);

    console.log('Seeding posts...');
    const posts = [];
    for (let i = 0; i < users.length; i++) {
        for (let j = 1; j <= 5; j++) {
            const post = await prisma.post.create({
                data: {
                    desc: `Post ${j} by ${users[i].userName}`,
                    userId: users[i].id,
                    img: faker.datatype.boolean()
                        ? faker.image.urlPicsumPhotos({
                              width: 600,
                              height: 400,
                          })
                        : null,
                    video: null,
                    isSensitive: faker.datatype.boolean(0.1),
                },
            });
            posts.push(post);
        }
    }
    console.log('Posts created.');

    console.log('Seeding follows...');
    await prisma.follow.createMany({
        data: [
            { followerId: users[0].id, followingId: users[1].id },
            { followerId: users[0].id, followingId: users[2].id },
            { followerId: users[1].id, followingId: users[3].id },
            { followerId: users[2].id, followingId: users[4].id },
            { followerId: users[3].id, followingId: users[0].id },
        ],
    });
    console.log('Follows created.');

    console.log('Seeding likes...');
    await prisma.like.createMany({
        data: [
            { userId: users[0].id, postId: posts[0].id },
            { userId: users[1].id, postId: posts[1].id },
            { userId: users[2].id, postId: posts[2].id },
            { userId: users[3].id, postId: posts[3].id },
            { userId: users[4].id, postId: posts[4].id },
        ],
    });
    console.log('Likes created.');

    console.log('Seeding comments...');
    const comments = [];
    for (let i = 0; i < posts.length; i++) {
        const comment = await prisma.post.create({
            data: {
                desc: `Comment on Post ${posts[i].id} by ${users[(i + 1) % 5].userName}`,
                userId: users[(i + 1) % 5].id,
                parentPostId: posts[i].id,
            },
        });
        comments.push(comment);
    }
    console.log('Comments created.');

    console.log('Seeding reposts...');
    const reposts = [];
    for (let i = 0; i < posts.length; i++) {
        const repost = await prisma.post.create({
            data: {
                desc: `Repost of Post ${posts[i].id} by ${users[(i + 2) % 5].userName}`,
                userId: users[(i + 2) % 5].id,
                repostId: posts[i].id,
            },
        });
        reposts.push(repost);
    }
    console.log('Reposts created.');

    console.log('Seeding saved posts...');
    await prisma.savedPost.createMany({
        data: [
            { userId: users[0].id, postId: posts[1].id },
            { userId: users[1].id, postId: posts[2].id },
            { userId: users[2].id, postId: posts[3].id },
            { userId: users[3].id, postId: posts[4].id },
            { userId: users[4].id, postId: posts[0].id },
        ],
    });
    console.log('Saved posts created.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
