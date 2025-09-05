'use client';

import { X, Search } from 'lucide-react';
import { searchPeopleAction } from '../lib/actions/interactions-actions';
import { useState } from 'react';
import SearchResult from './search-result';

type searchType = {
    id: string;
    userName: string;
    displayName?: string | null;
    img?: string | null;
};

const ComposeMessage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<searchType[]>([]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (e.target.value.length > 1) {
            const res = await searchPeopleAction(query);
            setResults(res);
        } else {
            setResults([]);
        }
    };

    return (
        <form className='fixed w-screen h-screen top-0 left-0 z-50 bg-[#293139a6] flex justify-center'>
            <div className='py-4 rounded-xl bg-black w-[600px] h-max mt-64'>
                <div className='flex items-center justify-between flex-wrap gap-4 w-full'>
                    <div className='flex gap-4 px-4 items-center flex-wrap'>
                        <div className='cursor-pointer text-white'>
                            <X />
                        </div>
                        <h2 className='text-lg font-bold text-white'>
                            New Message
                        </h2>
                    </div>
                    <div className='flex gap-4 px-4 items-center flex-wrap'>
                        <button
                            type='submit'
                            className='rounded-full bg-white text-black py-2 px-4 font-bold flex '
                        >
                            Next
                        </button>
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
                <div className='mt-2 border-t border-textGray'>
                    <SearchResult results={results} />
                </div>
            </div>
        </form>
    );
};

export default ComposeMessage;
