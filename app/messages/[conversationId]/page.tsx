import { auth } from '@clerk/nextjs/server';
import { Info, MessageSquare, MoreHorizontal } from 'lucide-react';
import { prisma } from '../../../db/prisma';
import ImageComponent from '../../../components/image';
import { format } from 'timeago.js';
import { notFound } from 'next/navigation';
import { fetchConversationAction } from '../../../lib/actions/interactions-actions';
import SearchBar from '../../../components/search-bar';
import MessageList from '../../../components/message-list';
import MessageThread from '../../../components/message-thread';

interface Props {
    params: Promise<{ conversationId: string }>;
}

const ConversationPage = async ({ params }: Props) => {
    const { conversationId } = await params;
    if (!conversationId) {
        notFound();
    }
    const { userId } = await auth();
    if (!userId) return;

    const conversation = await fetchConversationAction(conversationId);
    //console.log('TestCreated Convo: ', conversation);
    if (!conversation) return;

    const currentUserData = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            img: true,
            bio: true,
            userName: true,
            displayName: true,
            followers: true,
            createdAt: true,
        },
    });

    return (
        <div className='flex'>
            <div className='sm:min-w-[600px]  flex flex-col gap-4 lg:min-w-[400px] border-r h-screen border-borderGray'>
                <div className='flex gap-4 m-4 justify-between flex-wrap'>
                    <div className=''>
                        <h1 className='text-xl font-bold text-textGraylight flex-wrap'>
                            Messages
                        </h1>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <MoreHorizontal width={20} height={20} />
                        <MessageSquare width={20} height={20} />
                    </div>
                    <div className='w-full mt-4'>
                        <SearchBar />
                    </div>
                </div>
                <MessageList
                    currentUserData={currentUserData}
                    currentUserConversations={conversation}
                />
            </div>
            <div className='gap-4 w-full relative h-screen'>
                <div className='flex gap-4 m-4 justify-between flex-wrap'>
                    <div className=''>
                        <h1 className='text-xl font-bold text-textGraylight flex-wrap'>
                            {currentUserData?.userName}
                        </h1>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <Info width={20} height={20} />
                    </div>
                </div>
                <div className='w-[100px] aspect-square rounded-full overflow-hidden border-4 border-black m-auto '>
                    <ImageComponent
                        path={
                            currentUserData?.img ||
                            'posts/blank-profile-picture-973460_640.png'
                        }
                        alt='avatar'
                        w={100}
                        h={100}
                        tr={true}
                    />
                </div>
                <div className='flex flex-col items-center'>
                    <h1 className='font-bold text-textGraylight flex-wrap'>
                        {currentUserData?.displayName}
                    </h1>
                    <p className='text-textGray'>
                        @{currentUserData?.userName}
                    </p>
                    <h1 className='mt-4 font-bold text-textGraylight flex-wrap'>
                        {currentUserData?.bio || 'bio'}
                    </h1>
                </div>
                <div className='flex m-4 justify-center items-center'>
                    <p className='text-textGray'>
                        joind {format(currentUserData?.createdAt || '')}
                    </p>
                </div>
                <div className='bottom-0 p-2 fixed border-t-borderGray border-t-2'>
                    <MessageThread conversation={conversation} />
                </div>
            </div>
        </div>
    );
};

export default ConversationPage;
