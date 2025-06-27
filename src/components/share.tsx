import ImageComponent from "./image";
import {
    Image,           
    BarChart2,       
    Smile,          
    CalendarClock,   
    MapPin,         
  } from 'lucide-react';


const Share = () => {
    return ( 
        <div className="p-4 flex gap-4 ">
            {/* avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <ImageComponent 
                    path="/posts/profile.jpeg"
                    alt='user avatar'
                    w={100}
                    h={100}
                    tr={true}
                />
            </div>
            {/* others */}
            <div className="flex-1 flex flex-col gap-4">
                <input type="text" placeholder="What is happening?! " />
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex gap-4 flex-wrap">
                        {/* icons */}
                        <Image
                            width={20} // Directly set width to 20px
                            height={20} // Directly set height to 20px
                            className="cursor-pointer text-blue-400 hover:text-blue-300" // Tailwind classes for styling
                        />
                        <ImageComponent 
                            path='/icons/gif.svg'
                            alt='icon'
                            w={20}
                            h={20}
                            className="cursor-pointer"
                            tr={true}
                        />
                        <BarChart2
                            width={20}
                            height={20}
                            className="cursor-pointer text-blue-400 hover:text-blue-300"
                        />
                        <Smile
                            width={20}
                            height={20}
                            className="cursor-pointer text-blue-400 hover:text-blue-300"
                        />
                        <CalendarClock
                            width={20}
                            height={20}
                            className="cursor-pointer text-blue-400 hover:text-blue-300"
                        />
                        <MapPin
                            width={20}
                            height={20}
                            className="cursor-pointer text-blue-400 hover:text-blue-300"
                        />
                    </div>
                    <button className="bg-white text-black rounded-full py-2 px-4">Post</button>
                </div>
            </div>
        </div>
     );
}
 
export default Share;