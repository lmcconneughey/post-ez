import Image from "next/image";
import Link from "next/link";
import {
    Home,
    Compass,
    Bell,
    MessageSquare,
    Bookmark,
    Briefcase,
    Users,
    Award, 
    User,
    MoreHorizontal,
    ListPlus,
  } from 'lucide-react'
  
const menuList = [
    {
    id: 1,
    name: "Homepage",
    link: "/",
    icon: Home, 
    },
    {
    id: 2,
    name: "Explore",
    link: "/",
    icon: Compass, 
    },
    {
    id: 3,
    name: "Notification",
    link: "/",
    icon: Bell, 
    },
    {
    id: 4,
    name: "Messages",
    link: "/",
    icon: MessageSquare, 
    },
    {
    id: 5,
    name: "Bookmarks",
    link: "/",
    icon: Bookmark, 
    },
    {
    id: 6,
    name: "Jobs",
    link: "/",
    icon: Briefcase, 
    },
    {
    id: 7,
    name: "Communities",
    link: "/",
    icon: Users, 
    },
    {
    id: 8,
    name: "Premium",
    link: "/",
    icon: Award, 
    },
    {
    id: 9,
    name: "Profile",
    link: "/",
    icon: User, 
    },
    {
    id: 10,
    name: "More",
    link: "/",
    icon: MoreHorizontal, 
    },
];


const LeftBar = () => {
    return ( 
        <div className="sticky top-0 h-screen flex flex-col justify-between pt-2 pb-8">
            {/* logo menu button */}
            <div className="flex flex-col gap-4 text-lg items-center 2xl:items-start">
                {/* logo */}
                <Link href='/' className="p-2 rounded-full ">
                    <Image 
                        src='/icons/logo.png' 
                        alt='logo'
                        width={24}
                        height={24}
                        className=""
                    />
                </Link>
                {/* menu list*/}
                <div className="flex flex-col gap-2">
                    {
                        menuList.map( item => (
                            <Link 
                                href={item.link} 
                                key={item.id}
                                className="p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
                            >
                                <item.icon />
                                <span className="hidden 2xl:inline">{item.name}</span>
                            </Link>
                        ))
                    }
                </div>
                {/* button */}
                <Link href='/' className=" bg-white text-black rounded-full w-12 h-12 flex items-center justify-center 2xl:hidden">
                    <ListPlus />
                </Link>
                <Link href='/' className="hidden 2xl:block bg-white text-black rounded-full font-bold py-2 px-20">
                    Post
                </Link>
            </div>
            {/* user */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden">
                        <Image 
                            src='/general/profile.jpeg'
                            alt='profile-pic'
                            fill
                        />
                    </div>
                    <div className="hidden 2xl:flex flex-col">
                        <span className="font-bold">LarryDev</span>
                        <span className="text-sm text-textGray">@LarryDev</span>
                    </div>
                </div>
                <div className="hidden 2xl:block cursor-pointer font-bold">...</div>
            </div>
        </div>
     );
}
 
export default LeftBar;