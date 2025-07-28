'use client';

import { useRouter } from 'next/navigation';
import ImageComponent from '../../../../../components/image';
import {
    BarChart2,
    CalendarClock,
    ImageIcon,
    MapPin,
    Smile,
} from 'lucide-react';
import { upload } from '@imagekit/next';
import { PostContext } from '../../../../../components/infiniteFeed';
import { useContext, useRef, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddPostInput, AddPostResult } from '../../../../../types';
import { addPostAction } from '../../../../../lib/actions/interactions-actions';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import ImageEditor from '../../../../../components/image-editor';

type UserImgType = {
    img: string | null;
} | null;
interface ComposePostProps {
    userData: UserImgType;
    userProfileId: string | undefined | null;
}

const ComposePost = ({ userData, userProfileId }: ComposePostProps) => {
    console.log('ComposePost rendered');
    const router = useRouter();
    const [modalPreviewUrl, setModalPreviewUrl] = useState<string | null>(null);
    const [modalFile, setModalFile] = useState<File | null>(null);
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

    // disable scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const closeModel = () => {
        router.back();
    };
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
                    console.warn('PostContext not available (composePost).');
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
                // close model and show updated feed
                closeModel();
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

    const handleModalMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (
            (selectedFile && selectedFile.type.startsWith('image/')) ||
            (selectedFile && selectedFile.type.startsWith('video/'))
        ) {
            setModalFile(selectedFile);
            setModalPreviewUrl(URL.createObjectURL(selectedFile));
            setClientError(null);
        }
    };
    const resetMedia = () => {
        setModalFile(null);
        setModalPreviewUrl(null);
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

        if (!modalFile && !desc.trim()) {
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

        if (modalFile) {
            try {
                const authRes = await fetch('/api/upload-auth');
                if (!authRes.ok) {
                    throw new Error(
                        `Failed to get upload authorization: ${authRes.statusText}`,
                    );
                }
                const { token, signature, expire, publicKey } =
                    await authRes.json();

                const isImage = modalFile.type.startsWith('image/');

                const result = await upload({
                    file: modalFile,
                    fileName: modalFile.name,
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
                uploadedFileType = modalFile.type;
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
        <form
            onSubmit={handleSubmit}
            className='fixed w-screen h-screen top-0 left-0 z-[9999] bg-[#293139a6] flex justify-center'
        >
            {/* top section */}
            <div className='py-4 px-8 rounded-xl bg-black w-[600px] h-max mt-12'>
                {/* top */}
                <div className='flex items center justify-between'>
                    <div onClick={closeModel} className='cursor-pointer'>
                        x
                    </div>
                    <div className='text-iconBlue font-bold'>draft</div>
                </div>
                {/* container */}
                <div className='py-8 flex gap-4'>
                    <div className='relative w-10 h-10 rounded-full overflow-hidden'>
                        <ImageComponent
                            path={
                                userData?.img ||
                                'posts/blank-profile-picture-973460_640.png'
                            }
                            alt='test profile image'
                            w={100}
                            h={100}
                            tr={true}
                        />
                    </div>
                    <input
                        onChange={(e) => setDesc(e.target.value)}
                        className='flex-1 bg-transparent outline-none text-lg'
                        value={desc}
                        name='desc'
                        type='text'
                        placeholder='What is happening'
                        disabled={addPostMutation.isPending}
                    />
                    {/* Display client-side errors */}
                    {clientError && (
                        <p className='text-red-500 text-sm mt-1'>
                            {clientError}
                        </p>
                    )}
                </div>
                {/* preview images */}
                {modalPreviewUrl && (
                    <div className='mb-8'>
                        {modalFile?.type.startsWith('image/') &&
                        modalPreviewUrl ? (
                            <div className='relative ml-10 rounded-xl overflow-hidden'>
                                <Image
                                    src={modalPreviewUrl}
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
                        ) : modalFile?.type.startsWith('video/') &&
                          modalPreviewUrl ? (
                            <div className='relative'>
                                <video
                                    src={modalPreviewUrl}
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
                {isEditorOpen && modalPreviewUrl && (
                    <ImageEditor
                        onClose={() => setIsEditorOpen(false)}
                        previewUrl={modalPreviewUrl}
                        settings={settings}
                        setSettings={setSettings}
                    />
                )}
                {/* bottom */}
                <div className='flex items-center justify-between gap-4 flex-wrap border-t border-borderGray pt-4'>
                    <div className='flex flex-wrap gap-4'>
                        <input
                            type='file'
                            name='file'
                            onChange={handleModalMediaChange}
                            className='hidden'
                            ref={inputRef}
                            id='modal-file'
                            accept='image/*,video/*'
                            disabled={addPostMutation.isPending}
                        />
                        <label htmlFor='modal-file'>
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
                            addPostMutation.isPending ||
                            (!modalFile && !desc.trim())
                        }
                        className='rounded-full bg-white text-black py-2 px-4 font-bold'
                    >
                        {addPostMutation.isPending ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ComposePost;
