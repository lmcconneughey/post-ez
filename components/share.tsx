'use client';

import React, { useRef, useState, useContext } from 'react';
import { PostContext } from './infiniteFeed';
import ImageComponent from './image';
import {
    Image as ImageIcon,
    BarChart2,
    Smile,
    CalendarClock,
    MapPin,
} from 'lucide-react';
import Image from 'next/image';
import { upload } from '@imagekit/next';
import ImageEditor from './image-editor';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { addPostAction } from '../lib/actions/interactions-actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddPostInput, AddPostResult } from '../types';

const Share = ({ userProfileId }: { userProfileId?: string | null }) => {
    console.log('userprofileid: ', userProfileId);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [desc, setDesc] = useState('');
    const [settings, setSettings] = useState<{
        type: 'original' | 'wide' | 'square';
        sensitive: boolean;
    }>({
        type: 'original',
        sensitive: false,
    });

    const [clientError, setClientError] = useState<string | null>(null);
    const { user } = useUser();
    const inputRef = useRef<HTMLInputElement>(null);
    const postContext = useContext(PostContext);
    const queryClient = useQueryClient();
    const router = useRouter();

    const addPostMutation = useMutation<AddPostResult, Error, AddPostInput>({
        mutationFn: addPostAction,
        onSuccess: (data) => {
            if (data.success) {
                if (postContext && data.post) {
                    postContext.addPost(data.post); // This is where PostWithRelations is now "used"
                    console.log(
                        'Post added successfully via PostContext for instant update.',
                    );
                } else {
                    // Fallback to query invalidation if context isn't available

                    console.warn(
                        'PostContext not available or post data missing, falling back to query invalidation.',
                    );
                }
                queryClient.invalidateQueries({
                    queryKey: [
                        'posts',
                        userProfileId ?? null,
                        user?.id ?? null,
                    ],
                });
                queryClient.invalidateQueries({
                    queryKey: ['posts'],
                    exact: false,
                });

                // Clear the form after successful submission
                setDesc('');
                resetMedia();
                setSettings({
                    type: 'original',
                    sensitive: false,
                });
                router.refresh();
                console.log('Post added successfully! Feed will update.');
            } else {
                console.error('Failed to add post (server-side):', data.error);
                setClientError(data.error); // Display server-provided error
            }
        },
        onError: (error) => {
            // Handle unexpected errors
            console.error(
                'An unexpected error occurred during post creation:',
                error,
            );
            setClientError(
                error.message || 'Failed to create post. Please try again.',
            );
            // toast.error(`Failed to create post: ${error.message || 'Please try again.'}`);
        },
        onSettled: () => {},
    });

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (
            (selectedFile && selectedFile.type.startsWith('image/')) ||
            (selectedFile && selectedFile.type.startsWith('video/'))
        ) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setClientError(null);
        }
    };
    const resetMedia = () => {
        setFile(null);
        setPreviewUrl(null);
        setIsEditorOpen(false);
        if (inputRef.current) inputRef.current.value = '';
    };

    const getTransformations = () => {
        switch (settings.type) {
            case 'square':
                return 'w-600,ar-1-1';
            case 'wide':
                return 'w-600,ar-16-9';
            default:
                return 'w-600,h-600';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file && !desc.trim()) {
            alert('Please enter a description or select media to upload.');
            return;
        }
        setClientError(null);

        if (addPostMutation.isPending) {
            console.log(
                'Mutation is already pending, preventing duplicate submission.',
            );
            return;
        }
        let uploadedFileUrl: string | undefined = undefined;
        let uploadedFileType: string | undefined = undefined;
        let uploadedImgHeight: number | undefined = undefined;
        let uploadedImgWidth: number | undefined = undefined;
        let uploadedTransformType: 'original' | 'wide' | 'square' | undefined =
            undefined;

        if (file) {
            try {
                const authRes = await fetch('/api/upload-auth');
                if (!authRes.ok) {
                    throw new Error(
                        `Failed to get upload authorization: ${authRes.statusText}`,
                    );
                }
                const { token, signature, expire, publicKey } =
                    await authRes.json();

                const isImage = file.type.startsWith('image/');

                const result = await upload({
                    file,
                    fileName: file.name,
                    token,
                    signature,
                    expire,
                    publicKey,
                    folder: 'posts',
                    ...(isImage && {
                        transformation: {
                            pre: getTransformations(),
                        },
                    }),
                    customMetadata: {
                        sensitive: settings.sensitive,
                    },
                });

                if (!result.url) {
                    throw new Error(
                        'Media upload failed: Missing URL from ImageKit response.',
                    );
                }

                uploadedFileUrl = result.url;
                uploadedFileType = file.type;
                uploadedImgHeight =
                    isImage && result.height !== undefined
                        ? Number(result.height)
                        : undefined; // Change from null
                uploadedImgWidth =
                    isImage && result.width !== undefined
                        ? Number(result.width)
                        : undefined; // Change from null
                uploadedTransformType = settings.type;

                console.log('Media uploaded URL:', result.url);
            } catch (err) {
                console.error('Media upload failed:', err);
                setClientError(
                    `Media upload failed: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`,
                );
                return;
            }
        }
        addPostMutation.mutate({
            desc,
            fileUrl: uploadedFileUrl,
            fileType: uploadedFileType,
            isSensitive: settings.sensitive,
            imgHeight: uploadedImgHeight,
            imgWidth: uploadedImgWidth,
            transformType: uploadedTransformType,
        });
    };

    return (
        <form className='p-4 flex gap-4' onSubmit={handleSubmit}>
            {/* avatar */}
            <div className='relative w-10 h-10 rounded-full overflow-hidden'>
                <ImageComponent
                    path={
                        user?.imageUrl ||
                        'posts/blank-profile-picture-973460_640.png'
                    }
                    alt='user avatar'
                    w={100}
                    h={100}
                    tr={true}
                />
            </div>
            {/* others */}
            <div className='flex-1 flex flex-col gap-4'>
                <input
                    onChange={(e) => setDesc(e.target.value)}
                    type='text'
                    name='desc'
                    value={desc}
                    placeholder='What is happening?!'
                    className='bg-transparent outline-none placeholder:text-textGray text-xl'
                    disabled={addPostMutation.isPending}
                />
                {/* Display client-side errors */}
                {clientError && (
                    <p className='text-red-500 text-sm mt-1'>{clientError}</p>
                )}
                {/* preview image */}
                {previewUrl && (
                    <div className='mt-2'>
                        {file?.type.startsWith('image/') && previewUrl ? (
                            <div className='relative rounded-xl overflow-hidden'>
                                <Image
                                    src={previewUrl}
                                    alt='Preview'
                                    width={600}
                                    height={600}
                                    className={`w-full ${
                                        settings.type === 'original'
                                            ? 'h-full object-contain'
                                            : settings.type === 'square'
                                              ? 'aspect-square object-cover'
                                              : 'aspect-video object-cover'
                                    }`}
                                />
                                <div
                                    className='absolute top-2 left-2 bg-black text-white py-1 px-4 opacity-60 rounded-full font-bold text-sm cursor-pointer'
                                    onClick={() => setIsEditorOpen(true)}
                                >
                                    Edit
                                </div>
                                <div
                                    className='absolute top-2 right-2 bg-black text-white py-1 px-4 flex items-center justify-center opacity-60 rounded-full font-bold text-sm cursor-pointer'
                                    onClick={resetMedia}
                                >
                                    x
                                </div>
                            </div>
                        ) : file?.type.startsWith('video/') && previewUrl ? (
                            <div className='relative'>
                                <video
                                    src={previewUrl}
                                    controls
                                    className='rounded-lg max-h-64'
                                />
                                <div
                                    className='absolute top-2 right-2 bg-black text-white py-1 px-4 flex items-center justify-center opacity-60 rounded-full font-bold text-sm cursor-pointer'
                                    onClick={resetMedia}
                                >
                                    x
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
                {isEditorOpen && previewUrl && (
                    <ImageEditor
                        onClose={() => setIsEditorOpen(false)}
                        previewUrl={previewUrl}
                        settings={settings}
                        setSettings={setSettings}
                    />
                )}
                <div className='flex items-center justify-between gap-4 flex-wrap'>
                    <div className='flex gap-4 flex-wrap'>
                        {/* icons */}
                        <input
                            type='file'
                            name='file'
                            onChange={handleMediaChange}
                            className='hidden'
                            ref={inputRef}
                            id='file'
                            accept='image/*,video/*'
                            disabled={addPostMutation.isPending}
                        />
                        <label htmlFor='file'>
                            <ImageIcon
                                width={20} // Directly set width to 20px
                                height={20} // Directly set height to 20px
                                className='cursor-pointer text-blue-400 hover:text-blue-300' // Tailwind classes for styling
                                role='icon'
                                aria-label='image icon'
                            />
                        </label>
                        <ImageComponent
                            path='/icons/gif.svg'
                            alt='icon'
                            w={20}
                            h={20}
                            className='cursor-pointer'
                            tr={true}
                        />
                        <BarChart2
                            width={20}
                            height={20}
                            className='cursor-pointer text-blue-400 hover:text-blue-300'
                        />
                        <Smile
                            width={20}
                            height={20}
                            className='cursor-pointer text-blue-400 hover:text-blue-300'
                        />
                        <CalendarClock
                            width={20}
                            height={20}
                            className='cursor-pointer text-blue-400 hover:text-blue-300'
                        />
                        <MapPin
                            width={20}
                            height={20}
                            className='cursor-pointer text-blue-400 hover:text-blue-300'
                        />
                    </div>
                    <button
                        type='submit'
                        disabled={
                            addPostMutation.isPending || (!file && !desc.trim())
                        }
                        className='bg-white text-black rounded-full py-2 px-4'
                    >
                        {addPostMutation.isPending ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Share;
