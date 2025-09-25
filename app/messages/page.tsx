import { auth } from '@clerk/nextjs/server';
import Messages from '../../components/messages';
import { fetchConversationsAction } from '../../lib/actions/interactions-actions';

const MessagesHomePage = async () => {
    const { userId } = await auth();
    if (!userId) return [];

    const conversations = await fetchConversationsAction(userId);
    if (!conversations) return;
    return <Messages conversations={conversations} />;
};

export default MessagesHomePage;
