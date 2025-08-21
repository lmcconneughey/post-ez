'use client';

import { useRouter } from 'next/navigation';
import ImageComponent from './image';
import { useEffect, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { editProfileAction } from '../lib/actions/interactions-actions';
import { EditProfileFormState } from '../types';
import ImageCropper from './image-cropper';
import { upload } from '@imagekit/next';
import Image from 'next/image';

type Props = {
    user: {
        displayName: string | null;
        bio?: string | null;
        img?: string | null;
        cover?: string | null;
        website?: string | null;
        location?: string | null;
    };
};

const EditProfile = ({ user }: Props) => {
    // const initialState: EditProfileFormState = { errors: {} };
    // const [state, formAction] = useActionState(editProfileAction, initialState);
    const router = useRouter();

    const [formState, setFormState] = useState<EditProfileFormState>({
        errors: {},
    });
    const [isSaving, setIsSaving] = useState(false);

    // original files to crop
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // cropped versions + previews
    const [croppedCover, setCroppedCover] = useState<File | null>(null);
    const [croppedCoverPreview, setCroppedCoverPreview] = useState<
        string | null
    >(null);
    const [croppedAvatar, setCroppedAvatar] = useState<File | null>(null);
    const [croppedAvatarPreview, setCroppedAvatarPreview] = useState<
        string | null
    >(null);

    const closeModal = () => router.back();

    const uploadFile = async (
        file: File,
        folder: string,
        transform: string,
    ) => {
        const authRes = await fetch('/api/upload-auth');
        if (!authRes.ok) throw new Error('Failed to get upload auth');
        const { token, signature, expire, publicKey } = await authRes.json();

        const result = await upload({
            file,
            fileName: file.name,
            token,
            signature,
            expire,
            publicKey,
            folder,
            transformation: { pre: transform },
        });

        if (!result.url) throw new Error('Upload failed: no URL');
        return result.url;
    };

    const handleCropCover = (blob: Blob) => {
        if (croppedCoverPreview) {
            URL.revokeObjectURL(croppedCoverPreview);
        }

        const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
        const newUrl = URL.createObjectURL(file);

        setCroppedCover(file);
        setCroppedCoverPreview(newUrl);
        setCoverFile(null);
    };

    const handleCropAvatar = (blob: Blob) => {
        if (croppedAvatarPreview) {
            URL.revokeObjectURL(croppedAvatarPreview);
        }

        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        const newUrl = URL.createObjectURL(file);

        setCroppedAvatar(file);
        setCroppedAvatarPreview(newUrl);
        setAvatarFile(null);
    };

    useEffect(() => {
        return () => {
            if (croppedCoverPreview) URL.revokeObjectURL(croppedCoverPreview);
            if (croppedAvatarPreview) URL.revokeObjectURL(croppedAvatarPreview);
        };
    }, [croppedCoverPreview, croppedAvatarPreview]);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setFormState({ errors: {} });

        const form = e.currentTarget;
        const name =
            (form.elements.namedItem('name') as HTMLInputElement)?.value || '';
        const bio =
            (form.elements.namedItem('bio') as HTMLTextAreaElement)?.value ||
            '';
        const location =
            (form.elements.namedItem('location') as HTMLInputElement)?.value ||
            '';
        const website =
            (form.elements.namedItem('website') as HTMLInputElement)?.value ||
            '';

        try {
            const cover = croppedCover
                ? await uploadFile(croppedCover, 'profiles', 'w-600,h-200')
                : undefined;
            const img = croppedAvatar
                ? await uploadFile(croppedAvatar, 'profiles', 'w-200,h-200')
                : undefined;

            const data = {
                name,
                bio,
                location,
                website,
                cover: cover,
                img: img,
            };

            // Call the mock function instead of the server action
            const result = await editProfileAction(undefined, data);

            console.log('Profile update result:', result);
            setFormState(result);
        } catch (error) {
            console.error('Submission failed:', error);
            setFormState({
                errors: {
                    _form: 'Failed to update profile due to an unexpected error.',
                },
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className='fixed w-screen h-screen top-0 left-0 z-50 bg-[#293139a6] flex justify-center'
        >
            <div className='py-4 px-8 rounded-xl bg-black w-[600px] h-max mt-12'>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                    <div className='flex gap-4 items-center flex-wrap'>
                        <div
                            onClick={closeModal}
                            className='cursor-pointer text-white'
                        >
                            <X />
                        </div>
                        <h2 className='text-lg font-bold text-white'>
                            Edit Profile
                        </h2>
                    </div>
                    <button
                        type='submit'
                        className='rounded-full bg-white text-black py-2 px-4 font-bold flex'
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>

                {/* cover */}
                <div className='w-full mt-3 relative'>
                    <div className='w-full aspect-[3/1] relative'>
                        {croppedCoverPreview ? (
                            <Image
                                src={croppedCoverPreview}
                                alt='Cropped Cover Preview'
                                fill
                                className='rounded-md object-cover'
                            />
                        ) : (
                            <ImageComponent
                                path={
                                    user.cover ||
                                    'posts/mountains-5819652_640.jpg'
                                }
                                alt='cover'
                                w={600}
                                h={200}
                                tr={true}
                            />
                        )}
                    </div>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white p-2 opacity-60 rounded-full font-bold text-sm cursor-pointer'>
                        <input
                            type='file'
                            name='cover'
                            className='hidden'
                            id='cover-file'
                            accept='image/*'
                            onChange={(e) => {
                                if (e.target.files?.[0])
                                    setCoverFile(e.target.files[0]);
                            }}
                        />
                        <label htmlFor='cover-file'>
                            <ImagePlus />
                        </label>
                    </div>
                    <div className='absolute top-2 right-2 bg-black text-white p-2 opacity-60 rounded-full font-bold text-sm cursor-pointer'>
                        <X />
                    </div>
                    {/* avatar */}
                    <div className='w-1/5 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-5/12'>
                        {croppedAvatarPreview ? (
                            <Image
                                src={croppedAvatarPreview}
                                alt='Cropped Avatar Preview'
                                fill
                                className='rounded-full object-cover'
                            />
                        ) : (
                            <ImageComponent
                                path={
                                    user.img ||
                                    'posts/blank-profile-picture-973460_640.png'
                                }
                                alt='avatar'
                                w={100}
                                h={100}
                                tr={true}
                            />
                        )}
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white p-2 opacity-60 rounded-full font-bold text-sm cursor-pointer'>
                            <input
                                type='file'
                                className='hidden'
                                id='avatar-file'
                                accept='image/*'
                                onChange={(e) => {
                                    if (e.target.files?.[0])
                                        setAvatarFile(e.target.files[0]);
                                }}
                            />
                            <label htmlFor='avatar-file'>
                                <ImagePlus />
                            </label>
                        </div>
                    </div>
                </div>

                {/* text fields */}
                <div className='flex flex-col p-2 mt-24 border rounded-sm border-textGray'>
                    <p className='text-textGray'>name</p>
                    <input
                        type='text'
                        name='name'
                        defaultValue={user.displayName || ''}
                        className='bg-transparent outline-none text-xl text-white'
                    />
                </div>
                <div className='flex flex-col gap-4 p-2 mt-4 border rounded-sm border-textGray'>
                    <p className='text-textGray'>bio</p>
                    <textarea
                        name='bio'
                        defaultValue={user.bio || ''}
                        className='bg-transparent outline-none text-xl text-white'
                    />
                </div>
                <div className='flex flex-col p-2 mt-4 border rounded-sm border-textGray'>
                    <p className='text-textGray'>location</p>
                    <input
                        type='text'
                        name='location'
                        defaultValue={user.location || ''}
                        className='bg-transparent outline-none text-xl text-white'
                    />
                </div>
                <div className='flex flex-col p-2 mt-4 border rounded-sm border-textGray'>
                    <p className='text-textGray'>website</p>
                    <input
                        type='text'
                        name='website'
                        defaultValue={user.website || ''}
                        className='bg-transparent outline-none text-xl text-white'
                    />
                </div>
                {formState.errors && '_form' in formState.errors && (
                    <p className='text-red-500 text-center mt-4'>
                        {formState.errors._form}
                    </p>
                )}
            </div>

            {/* croppers */}
            {coverFile && (
                <ImageCropper
                    file={coverFile}
                    aspect={3 / 1}
                    cropShape='rect'
                    onCancel={() => setCoverFile(null)}
                    onCropComplete={handleCropCover}
                />
            )}

            {avatarFile && (
                <ImageCropper
                    file={avatarFile}
                    aspect={1}
                    cropShape='round'
                    onCancel={() => setAvatarFile(null)}
                    onCropComplete={handleCropAvatar}
                />
            )}
        </form>
    );
};

export default EditProfile;
