export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <>
            <div className='max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto flex justify-between'>
                <div className='flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray'>
                    {children}
                </div>
            </div>
        </>
    );
}
