import LeftBar from '../../components/left-bar';

export default function MessagesLayout({
    children,
    messagesModal,
}: {
    children: React.ReactNode;
    messagesModal: React.ReactNode;
}) {
    return (
        <>
            <div className='flex'>
                <div className='px-8'>
                    <LeftBar />
                </div>
                <div className='flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray'>
                    {children}
                </div>
            </div>
            {messagesModal}
        </>
    );
}
