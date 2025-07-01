import { Ellipsis } from "lucide-react";
import ImageComponent from "./image";
import Link from "next/link";

const PopularTags = () => {
    return ( 
        <div className='p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4'>
            <h1 className="text-xl font-bold text-textGraylight">{"What's"} Happening </h1>
            {/* trend */}
            <div className="flex gap-4">
                <div className="relative w-20 h-20 round-xl overflow-hidden">
                    {/* image */}
                    <ImageComponent 
                        path='posts/flute-7296582_1280.jpg'
                        alt={'event image'}
                        w={120}
                        h={120}
                        tr={true} 
                    />
                </div>
                <div className="flex-1">
                    <h2 className="text-textGraylight font-bold">The jazz club!</h2>
                    <span className="text-sm text-textGray">Last Night</span>
                </div>
            </div>
            {/* topics */}
            <div className="">
                <div className="flex items-center justify-between">
                    <span className="text-textGray text-sm">Technology * Trending</span>
                        <Ellipsis 
                            strokeWidth={1}
                        />
                </div>                
                    <h2 className="text-textGraylight font-bold">OpenAI</h2>
                    <span className="text-textGray text-sm">20k posts</span>
            </div>
            {/* topics */}
            <div className="">
                <div className="flex items-center justify-between">
                    <span className="text-textGray text-sm">Technology * Trending</span>
                        <Ellipsis 
                            strokeWidth={1}
                        />
                </div>                
                    <h2 className="text-textGraylight font-bold">OpenAI</h2>
                    <span className="text-textGray text-sm">20k posts</span>
            </div>
            {/* topics */}
            <div className="">
                <div className="flex items-center justify-between">
                    <span className="text-textGray text-sm">Technology * Trending</span>
                        <Ellipsis 
                            strokeWidth={1}
                        />
                </div>                
                    <h2 className="text-textGraylight font-bold">OpenAI</h2>
                    <span className="text-textGray text-sm">20k posts</span>
            </div>
            {/* topics */}
            <div className="">
                <div className="flex items-center justify-between">
                    <span className="text-textGray text-sm">Technology * Trending</span>
                        <Ellipsis 
                            strokeWidth={1}
                        />
                </div>                
                    <h2 className="text-textGraylight font-bold">OpenAI</h2>
                    <span className="text-textGray text-sm">20k posts</span>
            </div>
            {/* topics */}
            <div className="">
                <div className="flex items-center justify-between">
                    <span className="text-textGray text-sm">Technology * Trending</span>
                        <Ellipsis 
                            strokeWidth={1}
                        />
                </div>                
                    <h2 className="text-textGraylight font-bold">OpenAI</h2>
                    <span className="text-textGray text-sm">20k posts</span>
            </div>
            <Link 
                className="text-iconBlue"
                href='/'
            >
                Show More
            </Link>
        </div> );
}
 
export default PopularTags;