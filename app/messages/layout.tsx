import LeftBar from '../../components/left-bar';

export default function MessagesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className='flex'>
                <LeftBar />
                <div className='flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray'>
                    {children}
                </div>
            </div>
        </>
    );
}
