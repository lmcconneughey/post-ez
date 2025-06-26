import { Image } from "@imagekit/next";
import ImageComponent from "./image";
import PostInfo from "./post-info";
const Post = () => {
    return (
         <div className="p-4 border y-[1px] border-borderGray">
            {/* post type */}
            <div className="flex items-center gap-2 text-sm text-textGray mb-2 font-bold">
                icon
                <span>User reposted</span>
            </div>
            {/* post content */}
            <div className="flex gap-4">
                {/* avatar */}
                <div className="relative w-10 h-10 rounded-full overflow-x-hidden">
                    <ImageComponent 
                        path='/posts/man-4333898_640.jpg'
                        alt=''
                        w={100}
                        h={100}
                        tr={true}
                    />
                </div>
                {/* content */}
                <div className="flex-1 flex flex-col space-y-2">
                    {/* top */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-md font-bold">John D</h1>
                            <span className="text-textGray">@test-user</span>
                            <span className="text-textGray">1 day ago</span>
                        </div>
                        <PostInfo />
                    </div>
                    {/* text and media */}
                    <p>
                        Just published a new article about the latest trends 
                        in all things fun! Check it out if you're 
                        interested. #fun #life #webdev!

                    </p>
                    <ImageComponent 
                        path='/posts/flute-7296582_1280.jpg'
                        alt='test post image'
                        w={600}
                        h={600}
                    />
                </div>
            </div>
        </div> 
    );
}
 
export default Post;