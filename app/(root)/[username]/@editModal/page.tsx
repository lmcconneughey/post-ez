'use client';

import { useRouter } from 'next/navigation';

const EditModal = () => {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    return (
        <div
            onClick={handleClose}
            className='fixed w-screen h-screen top-0 left-0 z-[9999] bg-[#293139a6] flex justify-center items-center'
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className='bg-gray-800 p-8 rounded-lg shadow-lg'
            >
                <form>
                    <div className='text-white text-2xl'>Hello World</div>
                </form>
                <button onClick={handleClose}>Close Modal</button>
            </div>
        </div>
    );
};

export default EditModal;
