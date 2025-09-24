'use client';

import { X, Search } from 'lucide-react';
import { searchPeopleAction } from '../lib/actions/interactions-actions';
import { useState } from 'react';
import SearchResult from './search-result';
import ImageComponent from './image';
import { useRouter } from 'next/navigation';
import { createConversationAction } from '../lib/actions/interactions-actions';

type searchType = {
    id: string;
    userName: string;
    displayName?: string | null;
    img?: string | null;
};

const ComposeMessage = ({ onClose }: { onClose: () => void }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<searchType[]>([]);
    const [recipient, setRecipient] = useState<searchType[]>([]);
    // const [selectedParticipantIds, setSelectedParticipantIds] = useState<
    //     string[]
    // >([]);

    const router = useRouter();

    const handleClose = () => {
        return onClose();
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (e.target.value.length > 1) {
            const res = await searchPeopleAction(query);
            setResults(res);
        } else {
            setResults([]);
        }
    };
    const handleRecipient = (user: searchType) => {
        setRecipient(
            (prev) =>
                prev.some((u) => u.id === user.id) ? prev : [...prev, user], // avoid dups
        );
    };
    const handleDelete = (userId: string) => {
        setRecipient((prev) => prev.filter((r) => r.id !== userId));
    };

    const handleCreateConversation = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const newParticipantIds = recipient.map((r) => r.id);

            const conversation =
                await createConversationAction(newParticipantIds);

            //setSelectedParticipantIds(newParticipantIds);
            console.log('From Compose: ', conversation);

            if (conversation) {
                router.push(`/messages/${conversation.id}`);
            }
        } catch (error) {
            console.error('Failed to create conversation:', error);
        }
    };

    return (
        <form className='fixed w-screen h-screen top-0 left-0 z-50 bg-[#293139a6] flex justify-center'>
            <div className='py-4 rounded-xl bg-black w-[600px] h-max mt-64'>
                <div className='flex items-center justify-between flex-wrap gap-4 w-full'>
                    <div className='flex gap-4 px-4 items-center flex-wrap'>
                        <div
                            className='cursor-pointer text-white'
                            onClick={handleClose}
                        >
                            <X />
                        </div>
                        <h2 className='text-lg font-bold text-white'>
                            New Message
                        </h2>
                    </div>
                    <div className='flex gap-4 px-4 items-center flex-wrap'>
                        {recipient.length > 0 ? (
                            <button
                                onClick={handleCreateConversation}
                                className='rounded-full bg-white text-black py-1.5 px-4 font-bold flex '
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                className='rounded-full bg-textGray text-black py-1.5 px-4 font-bold flex '
                                disabled
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
                {/* text fields */}
                <div className='flex items-center gap-4 p-2 mt-4'>
                    <Search size={20} />
                    <input
                        onChange={handleSearch}
                        type='text'
                        name='search'
                        placeholder='Search peaple'
                        className='bg-transparent outline-none text-xl text-white'
                    />
                </div>
                <div className='flex items-center gap-2'>
                    {recipient &&
                        recipient.map((u) => (
                            <div
                                className='flex items-center rounded-full gap-2 py-1 px-2 border-[1px] border-borderGray'
                                key={u.id}
                            >
                                <ImageComponent
                                    path={
                                        u.img ||
                                        'posts/blank-profile-picture-973460_640.png'
                                    }
                                    alt='avatar'
                                    w={20}
                                    h={20}
                                    tr={true}
                                    className='rounded-full'
                                />
                                <p className='font-bold'>
                                    {u.displayName ?? u.userName}
                                </p>
                                <div
                                    className=''
                                    onClick={() => handleDelete(u.id)}
                                >
                                    <X className='text-iconBlue' size={20} />
                                </div>
                            </div>
                        ))}
                </div>
                <div className='mt-2 border-t border-textGray'>
                    <SearchResult
                        results={results}
                        onSelectUser={handleRecipient}
                    />
                </div>
            </div>
        </form>
    );
};

export default ComposeMessage;
