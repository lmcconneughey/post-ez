type Message = {
    id: string;
    body: string | null;
};

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
    return (
        <div
            className={`px-4 py-2 rounded-lg max-w-xs ${
                isOwn ? 'bg-iconBlue text-white' : 'bg-gray-700 text-white'
            }`}
        >
            {message.body}
        </div>
    );
};

export default MessageBubble;
