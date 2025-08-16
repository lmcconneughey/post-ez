import LeftBar from '../../components/left-bar';
import RightBar from '../../components/right-bar';

export default function RootLayout({
    children,
    modal,
    editModal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
    editModal: React.ReactNode;
}>) {
    return (
        <div className='max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto flex justify-between'>
            <div className='px-2 xsm:px-4 2xl:px-8 '>
                <LeftBar />
            </div>
            <div className='flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray'>
                {children}
                {modal}
                {editModal}
            </div>
            <div className='hidden lg:flex ml-4 md:ml-8 flex-1'>
                <RightBar />
            </div>
        </div>
    );
}
