'use client'

import { Video } from "@imagekit/next";

const urlEndpoint= process.env.NEXT_PUBLIC_URL_ENDPOINT

type VideoTypes = {
    path: string;
    classname?: string;
}

const VideoComponent = ({path, classname}: VideoTypes) => {
    
    return (
            <Video
                urlEndpoint={urlEndpoint}
                src={path} // The path to the video in your ImageKit account
                classname={classname}
<<<<<<< HEAD
                transformation={[{height: 1920, width: 1080, quality: 90}]}
=======
                transformation={[{ height: 400, width: 600, quality: 90 }]}
>>>>>>> 4d9c586 (Initial commit from new device)
                controls 
            />
    )
}
       
        
 
export default VideoComponent;