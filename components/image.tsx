'use client'


import { Image, buildSrc } from '@imagekit/next';
import { useState } from 'react';

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
    tr = false, 

}: ImageType ) => {
    const [loaded, setLoaded] = useState(false);
    const placeholderUrl = buildSrc({
        urlEndpoint: urlEndpoint as string,
        src: path,
        transformation: [
            tr ? { width: w, height: h } : {},
          {
            quality: 10,
            blur: 50,
          },
        ],
      });
    return ( 
            <Image
            urlEndpoint={urlEndpoint}
            src={path}
            alt={alt}
            width={w}
            height={h}
            loading='lazy'
            className={className}
            transformation={tr ? [{ width: w, height: h }] : []}
            style={{
                backgroundImage: `url(${placeholderUrl})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                transition: 'filter 0.1s ease-out',
                filter: loaded ? 'blur(0)' : 'blur(10px)',
              }}
            onLoad={() => setLoaded(true)}            
        />
     );
};
 
export default ImageComponent;