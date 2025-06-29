'use client'

import React, { useRef, useState } from "react";
import ImageComponent from "./image";
import {
    Image,           
    BarChart2,       
    Smile,          
    CalendarClock,   
    MapPin,
    Flag,         
  } from 'lucide-react';
import { upload } from "@imagekit/next";
import ImageEditor from "./image-editor";
//import { shareAction } from "../actions/share-actions";


const Share = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [settings, setSettings] = useState<{
    type: 'origional' | 'wide' | 'square';
    sensitive: boolean;
  }>({
    type: 'origional',
    sensitive: false,
  })
  const [isPosting, setIsPosting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image to upload.");

    try {
      setIsPosting(true);

      // Get auth params
      const authRes = await fetch("/api/upload-auth");
      const { token, signature, expire, publicKey } = await authRes.json();

      // Upload to ImageKit
      const result = await upload({
        file,
        fileName: file.name,
        token,
        signature,
        expire,
        publicKey,
        folder: 'posts',
      });

      console.log("Uploaded URL:", result.url);
      alert("Upload successful!");// for testing

      // Reset state 
      setFile(null);
      setPreviewUrl(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setIsPosting(false);
    }
  };
    // emplement X icon in preview window to delete preview image? href='/'
    return ( 
        <form className="p-4 flex gap-4" onSubmit={handleSubmit}>
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
                <input 
                    type="text" 
                    name='desc'
                    placeholder="What is happening?!" 
                    className="bg-transparent outline-none placeholder:text-textGray text-xl" 
                />
                {/* preview image */}
                {previewUrl && (
                    <div className="mt-2">
                        {file?.type.startsWith("image/") ? (
                        <div className="relative rounded-xl overflow-hidden">   
                            <img
                                src={previewUrl}
                                alt="Preview"
                                width={600}
                                height={600}
                                className="rounded-lg max-h-64 object-contain"
                            />
                            <div 
                                className='absolute top-2 left-2 bg-black text-white py-1 px-4 opacity-60 rounded-full font-bold text-sm cursor-pointer'
                                onClick={() => setIsEditorOpen(true)}
                                >
                                Edit
                            </div>
                        </div> 
                        ) : file?.type.startsWith("video/") ? (
                        <video
                            src={previewUrl}
                            controls
                            className="rounded-lg max-h-64"
                        />
                        ) : null}
                    </div>
                )}
                { isEditorOpen && previewUrl && 
                    <ImageEditor 
                        onClose={() => setIsEditorOpen(false)}
                        previewUrl={previewUrl}
                        settings={settings}
                        setSettings={setSettings}
                    />
                 }
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex gap-4 flex-wrap">
                        {/* icons */}
                        <input 
                            type='file' 
                            name='file'
                            onChange={handleMediaChange} 
                            className="hidden" 
                            ref={inputRef}
                            id='file'
                        />
                        <label htmlFor="file">
                            <Image
                                width={20} // Directly set width to 20px
                                height={20} // Directly set height to 20px
                                className="cursor-pointer text-blue-400 hover:text-blue-300" // Tailwind classes for styling
                            />
                         </label>
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
                    <button type='submit' disabled={isPosting} className="bg-white text-black rounded-full py-2 px-4">
                        {isPosting ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>
        </form>
     );
}
 
export default Share;