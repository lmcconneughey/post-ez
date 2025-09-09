import Image from 'next/image';
import Link from 'next/link';
import {
    Home,
    Compass,
    MessageSquare,
    Bookmark,
    Briefcase,
    Users,
    Award,
    User,
    MoreHorizontal,
    ListPlus,
} from 'lucide-react';
import Socket from './socket';
import Notification from './notification';
import { SignOutButton } from './sign-out';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../db/prisma';

const menuList = [
    {
        id: 1,
        name: 'Homepage',
        link: '/',
        icon: Home,
    },
    {
        id: 2,
        name: 'Explore',
        link: '/',
        icon: Compass,
    },
    // {
    //     id: 3,
    //     name: 'Notification',
    //     link: '/',
    //     icon: Bell,
    // },
    {
        id: 4,
        name: 'Messages',
        link: '/',
        icon: MessageSquare,
    },
    {
        id: 5,
        name: 'Bookmarks',
        link: '/',
        icon: Bookmark,
    },
    {
        id: 6,
        name: 'Jobs',
        link: '/',
        icon: Briefcase,
    },
    {
        id: 7,
        name: 'Communities',
        link: '/',
        icon: Users,
    },
    {
        id: 8,
        name: 'Premium',
        link: '/',
        icon: Award,
    },
    {
        id: 9,
        name: 'Profile',
        link: '/',
        icon: User,
    },
    {
        id: 10,
        name: 'More',
        link: '/',
        icon: MoreHorizontal,
    },
];

const LeftBar = async () => {
    const { userId } = await auth();
    console.log('Clerk userId from auth():', userId);

    if (!userId) {
        console.log('Feed: No userId found (user not authenticated).');
        return null;
    }
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            img: true,
            userName: true,
            displayName: true,
        },
    });
    if (!user) {
        console.log('LEFT BAR: no user Found');
        return (
            <div className='sticky top-0 h-screen flex flex-col justify-between pt-2 pb-8'>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className='sticky top-0 h-screen flex flex-col justify-between pt-2 pb-8'>
            {/* logo menu button */}
            <div className='flex flex-col gap-4 text-lg items-center 2xl:items-start'>
                {/* logo */}
                <Link href='/' className='p-2 rounded-full '>
                    <Image
                        src='/icons/logo.png'
                        alt='logo'
                        width={24}
                        height={24}
                        className=''
                    />
                </Link>
                {/* menu list*/}
                <div className='flex flex-col gap-2'>
                    {menuList.map((item) => {
                        const linkHref =
                            item.name === 'Profile'
                                ? `/${user.userName}`
                                : item.name === 'Messages'
                                  ? `/messages`
                                  : item.link;

                        return (
                            <div key={item.id}>
                                {item.id === 2 && (
                                    <div>
                                        <Notification />
                                    </div>
                                )}
                                <Link
                                    href={linkHref}
                                    className='p-2 rounded-full hover:bg-[#181818] flex items-center gap-4'
                                >
                                    <item.icon />
                                    <span className='hidden 2xl:inline'>
                                        {item.name}
                                    </span>
                                </Link>
                            </div>
                        );
                    })}
                </div>
                {/* button */}
                <Link
                    href='/compose/post'
                    className=' bg-white text-black rounded-full w-12 h-12 flex items-center justify-center 2xl:hidden'
                >
                    <ListPlus />
                </Link>
                <Link
                    href='/compose/post'
                    className='hidden 2xl:block bg-white text-black rounded-full font-bold py-2 px-20'
                >
                    Post
                </Link>
            </div>
            <Socket />
            {/* user */}
            <SignOutButton userData={user} />
        </div>
    );
};

export default LeftBar;
