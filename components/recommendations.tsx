import Link from "next/link";
import ImageComponent from "./image";

const Recommendations = () => {
    return ( 
        <div className="p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4">
            {/* user card */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative rounded-full overflow-hidden w-10 h-10">
                        <ImageComponent 
                            path='posts/woman-6401957_640.jpg'
                            alt='test avatar Doe John'
                            w={100}
                            h={100}
                            tr={true}
                        />
                    </div>  
                    <div className="">
                        <h1 className="text-md font-bold">Jane Doe</h1>
                        <span className="text-textGray text-sm">@JaneDoe</span>
                    </div>  
                </div>
                {/* button */}
                <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
                    Follow
                </button>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative rounded-full overflow-hidden w-10 h-10">
                        <ImageComponent 
                            path='posts/woman-6401957_640.jpg'
                            alt='test avatar Doe John'
                            w={100}
                            h={100}
                            tr={true}
                        />
                    </div>  
                    <div className="">
                        <h1 className="text-md font-bold">Jane Doe</h1>
                        <span className="text-textGray text-sm">@JaneDoe</span>
                    </div>  
                </div>
                {/* button */}
                <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
                    Follow
                </button>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative rounded-full overflow-hidden w-10 h-10">
                        <ImageComponent 
                            path='posts/woman-6401957_640.jpg'
                            alt='test avatar Doe John'
                            w={100}
                            h={100}
                            tr={true}
                        />
                    </div>  
                    <div className="">
                        <h1 className="text-md font-bold">Jane Doe</h1>
                        <span className="text-textGray text-sm">@JaneDoe</span>
                    </div>  
                </div>
                {/* button */}
                <button className="py-1 px-4 font-semibold bg-white text-black rounded-full">
                    Follow
                </button>
            </div>
            <Link 
                className="text-iconBlue"
                href='/'
            >
                Show More
            </Link>
        </div> );
}
 
export default Recommendations;