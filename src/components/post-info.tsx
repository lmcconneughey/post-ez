'use client'

import { Ellipsis } from "lucide-react";

const PostInfo = () => {
    return ( 
        <div className="cursor-pointer w-4 h-4">
            <Ellipsis 
                strokeWidth={1}
            />
        </div>
     );
}
 
export default PostInfo;