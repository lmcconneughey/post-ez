import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import Post from '../../../../../components/post';
import Comments from '../../../../../components/comments';

const StatusPage = () => {
    return (
        <div className=''>
            <div className='flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#000000 84]'>
                <Link href='/'>
                    <ArrowLeftIcon size={24} />
                </Link>
                <h1 className='font-bold text-lg'>Post</h1>
            </div>
            <Post type='status' />
            <Comments />
        </div>
    );
};

export default StatusPage;
