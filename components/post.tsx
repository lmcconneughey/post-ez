import Link from 'next/link';
//import { imagekit } from '../utils';
import ImageComponent from './image';
import PostInfo from './post-info';
import PostInteractions from './post-interactions';
//import Video from './video';

// interface FileDetailsResonse {
//     width: number;
//     height: number;
//     filePath: string;
//     url: string;
//     fileType: string;
//     customMetadata?: {
//         sensitive: boolean;
//     };
// }

const Post = ({ type }: { type?: 'status' | 'comment' }) => {
    // const getFileDetails = async (
    //     fileId: string,
    // ): Promise<FileDetailsResonse> => {
    //     return new Promise((resolve, reject) => {
    //         imagekit.getFileDetails(fileId, function (error, result) {
    //             if (error) {
    //                 reject(error);
    //             } else {
    //                 resolve(result as FileDetailsResonse);
    //             }
    //         });
    //     });
    // };

    //const fileDetails = await getFileDetails('68640eb35c7cd75eb8703504');
    //console.log('File details:', fileDetails);

    return (
        <div className='p-4 border y-[1px] border-borderGray'>
            {/* post type */}
            <div className='flex items-center gap-2 text-sm text-textGray mb-2 font-bold'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                >
                    <path
                        fill='#71767b'
                        d='M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z'
                    />
                </svg>
                <span>User reposted</span>
            </div>
            {/* post content */}
            {/* <div className='flex gap-4'> */}
            <div className={`flex gap-4 ${type === 'status' && 'flex-col'}`}>
                {/* avatar */}
                <div
                    className={`${type === 'status' && 'hidden'} relative w-10 h-10 rounded-full overflow-x-hidden`}
                >
                    <ImageComponent
                        path='/posts/man-4333898_640.jpg'
                        alt=''
                        w={100}
                        h={100}
                        tr={true}
                    />
                </div>
                {/* content */}
                <div className='flex-1 flex flex-col space-y-2'>
                    {/* top */}
                    <div className='w-full flex justify-between'>
                        <Link href={`/test`} className='flex gap-4'>
                            <div
                                className={`${type !== 'status' && 'hidden'} relative w-10 h-10 rounded-full overflow-x-hidden`}
                            >
                                <ImageComponent
                                    path='/posts/man-4333898_640.jpg'
                                    alt=''
                                    w={100}
                                    h={100}
                                    tr={true}
                                />
                            </div>
                            <div
                                className={`flex items-center gap-2 flex-wrap ${type === 'status' && 'flex-col gap-0 !items-start'}`}
                            >
                                <h1 className='text-md font-bold'>John D</h1>
                                <span
                                    className={`text-textGray ${type === 'status' && 'text-sm'}`}
                                >
                                    @test-user
                                </span>
                                {type !== 'status' && (
                                    <span className='text-textGray'>
                                        1 day ago
                                    </span>
                                )}
                            </div>
                        </Link>
                        <PostInfo />
                    </div>
                    {/* text and media */}
                    <Link href={`/test/status/willMkaeDynamic`}>
                        <p className={`${type == 'status' && 'text-lg'}`}>
                            Join me on this CI/CD adventure as I build a
                            Twitter/X clone to add to my portfolio. This project
                            will evolve as I implement key features like media
                            uploads, real time interactions, and thoughtful UI
                            design. #fun #life #webdev!
                        </p>
                    </Link>
                    {/* {fileDetails && fileDetails.fileType === 'image' ? (
                        <ImageComponent
                            path={fileDetails.filePath}
                            alt='test post image'
                            w={fileDetails.width}
                            h={fileDetails.height}
                            className={
                                fileDetails.customMetadata?.sensitive
                                    ? 'blur-lg'
                                    : ''
                            }
                        />
                    ) : (
                        <Video
                            path={fileDetails.filePath}
                            classname={
                                fileDetails.customMetadata?.sensitive
                                    ? 'blur-lg'
                                    : ''
                            }
                        />
                    )} */}
                    {type === 'status' && (
                        <span className='text-textGray'>
                            2:34 PM Jul 2, 2025
                        </span>
                    )}
                    <PostInteractions />
                </div>
            </div>
        </div>
    );
};

export default Post;
