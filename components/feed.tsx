import { prisma } from '../db/prisma';
import Post from './post';

const Feed = async () => {
    const posts = await prisma.post.findMany();
    return (
        <div className=''>
            {posts.map((post) => (
                <div key={post.id}>
                    <Post />
                </div>
            ))}
        </div>
    );
};

export default Feed;
