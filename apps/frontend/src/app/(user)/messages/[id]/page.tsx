'use client';

import { useParams } from 'next/navigation';
import { ConversationsList } from '@/components/conversations-list';
import { Chat } from '@/components/chat';
import { UserLayout } from '@/components/user-layout';

export default function ChatPage() {
  const params = useParams();
  const userId = params.id as string;

  return (
    <UserLayout>
      <div className="md:container mx-auto max-w-6xl md:p-4 md:pt-6 h-[calc(100vh-64px)]">
        <div className="md:border md:rounded-lg md:shadow-sm h-full overflow-hidden bg-white">
          <div className="md:grid md:grid-cols-[350px_1fr] h-full">
            <div className="hidden md:block">
              <ConversationsList selectedId={userId} />
            </div>
            <Chat userId={userId} />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

