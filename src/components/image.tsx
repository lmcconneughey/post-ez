'use client'

import { Image } from '@imagekit/next';

const urlEndpoint= process.env.NEXT_PUBLIC_URL_ENDPOINT

type ImageType = {
    path: string, 
    w?: number, 
    h?: number, 
    alt: string,
    className?: string, 
}

const ImageComponent = ({
    path, 
    w, 
    h, 
    alt,
    className 

}: ImageType) => {
    return ( 
        <Image
        urlEndpoint={urlEndpoint}
        src={path}
        width={w}
        height={h}
        alt={alt}
        className={className}
      />
     );
}
 
export default ImageComponent;