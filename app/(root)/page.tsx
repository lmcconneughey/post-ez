import Feed from '../../components/feed';
import Share from '../../components/share';
import Link from 'next/link';

const Homepage = () => {
    return (
        <div className=''>
            <div className='px-4 pt-4 flex justify-between text-textGray font-bold border-b-[1px] border-borderGray'>
                <Link className='pb-3 flex items-center' href='/'>
                    For you
                </Link>
                <Link
                    className='pb-3 flex items-center border-b-4 border-iconBlue'
                    href='/'
                >
                    Following
                </Link>
                <Link className='hidden pb-3 md:flex items-center' href='/'>
                    Victor Wooten
                </Link>
                <Link className='hidden pb-3 md:flex items-center' href='/'>
                    Mohini Dey
                </Link>
                <Link className='hidden pb-3 md:flex items-center' href='/'>
                    Esperanza Spalding
                </Link>
            </div>
            <Share />
            <Feed />
        </div>
    );
};

export default Homepage;
