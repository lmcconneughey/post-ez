type SearchType = {
    id: string;
    userName: string;
    displayName?: string | null;
    img?: string | null;
};

type SearchResultProps = {
    results: SearchType[];
};

const SearchResult = ({ results }: SearchResultProps) => {
    return (
        <div className='text-white'>
            {results.length === 0 ? (
                <p className='text-textGray px-4 py-2'>No results</p>
            ) : (
                results.map((user) => (
                    <div
                        key={user.id}
                        className='px-4 py-2 hover:bg-gray-800 cursor-pointer'
                    >
                        <p className='font-bold'>
                            {user.displayName ?? user.userName}
                        </p>
                        <p className='text-sm text-textGray'>
                            @{user.userName}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default SearchResult;
