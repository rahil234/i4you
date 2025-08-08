'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function UserModerationFilter() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Select defaultValue="all">
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Content</SelectItem>
          <SelectItem value="profile_photo">Profile Photos</SelectItem>
          <SelectItem value="bio_text">Bio Text</SelectItem>
          <SelectItem value="messages">Messages</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="newest">
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="flagged">Most Flagged</SelectItem>
        </SelectContent>
      </Select>
      <Button>Apply Filters</Button>
    </div>
  );
}
