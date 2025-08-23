'use client';

import React, { useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';

type Props = {
    file: File;
    aspect: number;
    cropShape?: 'rect' | 'round';
    onCancel: () => void;
    // eslint-disable-next-line no-unused-vars
    onCropComplete: (croppedBlob: Blob) => void;
};

export default function ImageCropper({
    file,
    aspect,
    cropShape = 'rect',
    onCancel,
    onCropComplete,
}: Props) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );

    const src = URL.createObjectURL(file);

    const finishCrop = async () => {
        if (!croppedAreaPixels) return;

        // convert cropped area into a Blob you can upload
        const canvas = document.createElement('canvas');
        const image = new Image();
        image.src = src;
        await new Promise((resolve) => (image.onload = resolve));

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
        );

        canvas.toBlob((blob) => {
            if (blob) onCropComplete(blob);
        }, 'image/jpeg');
    };

    return (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
            <div className='bg-black text-bl rounded-xl p-4 w-[600px] h-[600px] flex flex-col gap-2'>
                <div className='relative flex-1'>
                    <Cropper
                        image={src}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        cropShape={cropShape}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, areaPixels) =>
                            setCroppedAreaPixels(areaPixels)
                        }
                        style={{
                            containerStyle: {
                                backgroundColor: 'lightgray',
                            },
                        }}
                    />
                </div>
                <div className='flex justify-between mt-2'>
                    <button type='button' onClick={onCancel}>
                        Cancel
                    </button>
                    <button type='button' onClick={finishCrop}>
                        Crop
                    </button>
                </div>
            </div>
        </div>
    );
}
