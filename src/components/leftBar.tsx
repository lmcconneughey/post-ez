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
        <div className="h-screen sticky top-0 flex flex-col justify-between pt-2 pb-8">
            {/* logo menu button */}
            <div className="">
                {/* logo */}
                <Link href='/'>
                    <Image 
                        src='/icons/logo.png' 
                        alt='logo'
                        width={24}
                        height={24}
                        className="ml-2"
                    />
                </Link>
                {/* menu list*/}
                <div className="flex flex-col">
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
            </div>
            {/* user */}
            <div className="">user</div>
        </div>
     );
}
 
export default LeftBar;