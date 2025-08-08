'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageModerationQueue } from '@/components/user/moderation/image-moderation-queue';
import { ImageModerationFilter } from '@/components/user/moderation/image-moderation-filter';
import { useState } from 'react';
import { UserModerationQueue } from '@/components/user/moderation/user-moderation-queue';
import { UserModerationFilter } from '@/components/user/moderation/user-moderation-filter';

export default function ModerationPage() {
  const [status, setStatus] = useState<'approved' | 'pending' | 'rejected'>('pending');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt'>('createdAt');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Moderation</h1>
      </div>
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-10">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>
        <TabsContent value="reports">
          <UserModerationFilter />
          <UserModerationQueue />
        </TabsContent>
        <TabsContent value="images">
          <ImageModerationFilter
            status={status}
            sortBy={sortBy}
            onStatusChange={setStatus}
            onSortByChange={setSortBy}
          />
          <ImageModerationQueue status={status} sortBy={sortBy} />
        </TabsContent>
        <TabsContent value="text">
          text
        </TabsContent>
      </Tabs>
    </div>
  );
}
