import { ArrowLeft, ImageIcon, RectangleHorizontal, Square } from "lucide-react";
import Image from "next/image";

const ImageEditor = ({
    onClose,
    previewUrl,
    settings,
    setSettings

}: {
    onClose: () => void;
    previewUrl: string;
    settings: {
        type: 'origional' | 'wide' | 'square';
        sensitive: boolean;
    };
    setSettings: React.Dispatch<React.SetStateAction<{
        type: 'origional' | 'wide' | 'square';
        sensitive: boolean;
    }>>
}) => {
    const handleChangeSensitive = (sensitive: boolean) => {
        setSettings((prev) => ({...prev, sensitive}))
    }
    const handleChangeType = (type: 'origional' | 'wide' | 'square') => {
        setSettings((prev) => ({...prev, type}))
    }

    return ( 
        <div className="fixed w-screen h-screen left-0 top-0 bg-black z-10 flex items-center justify-center">
            <div className="bg-black rounded-xl p-12 flex flex-col gap-4">
                {/* top section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <ArrowLeft
                            width={32}
                            viewBox="0 0 24 24"
                            fill="#e7e9ea"
                            onClick={onClose}
                            className="cursor-pointer"
                        />
                        <h1 className="font-bold text-xl">Media Settings</h1>
                    </div>
                    <button
                        className="py-2 px-4 rounded-full bg-white text-black font-bold"
                        onClick={onClose}
                    >
                        Save
                    </button>
                </div>
                {/* image container */}
                <div className="w-[600px] h-[600px] flex items-center">
                  <Image 
                    src={previewUrl}
                    alt='preview image'
                    width={600}
                    height={600}
                    className={`w-full ${
                        settings.type === 'origional' 
                        ? 'h-full object-contain'
                        : settings.type === 'square'
                        ? 'aspect-square object-cover' 
                        : 'aspect-video object-cover'
                    }`}
                  />  
                </div>
                {/* settings */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-8">
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleChangeType('origional')}
                        >
                            {
                                settings.type === 'origional' 
                                ? (<ImageIcon className="text-iconBlue"/>)
                                : (<ImageIcon color="white" />)
                            }
                            Origional
                        </div>
                        
                    </div>
                    <div className="flex items-center gap-8">
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleChangeType('wide')}
                        >
                             {
                                settings.type === 'wide' 
                                ? (<RectangleHorizontal className="text-iconBlue"/>)
                                : (<RectangleHorizontal color="white" />)
                            }
                            Wide
                        </div>
                        
                    </div>
                    <div className="flex items-center gap-8">
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleChangeType('square')}
                        >
                            {
                                settings.type === 'square' 
                                ? (<Square className="text-iconBlue"/>)
                                : (<Square color="white" />)
                            }
                            Square
                        </div>
                        
                    </div>
                    <div className={`cursor-pointer py-1 px-4 rounded-full text-black ${
                        settings.sensitive
                        ? 'bg-red-500'
                        : 'bg-white'
                    }`}
                    onClick={() => handleChangeSensitive(!settings.sensitive)}
                    >
                        Sensitive
                    </div>
                </div>           
            </div>
        </div> );
}
 
export default ImageEditor;