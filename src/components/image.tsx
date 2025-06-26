'use client'

import { Image } from '@imagekit/next';

const urlEndpoint= process.env.NEXT_PUBLIC_URL_ENDPOINT

type ImageType = {
    path: string, 
    w?: number, 
    h?: number, 
    alt: string,
    className?: string, 
    tr?: boolean;
}

const ImageComponent = ({
    path, 
    w, 
    h, 
    alt,
    className,
    tr, 

}: ImageType ) => {
    return ( 
        <Image
            urlEndpoint={urlEndpoint}
            src={path}
            alt={alt}
            className={className}
            {...(tr ? {transformation: [{width: `${w}`}, {height: `${h}`}]} : { width: w, height: h}) }
      />
     );
};
 
export default ImageComponent;