'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  status: string;
  sortBy: string;
  onStatusChange: (value: 'pending' | 'approved' | 'rejected') => void;
  onSortByChange: (value: 'createdAt' | 'updatedAt') => void;
}

export function ImageModerationFilter({ status, sortBy, onStatusChange, onSortByChange }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">

      <Select value={status} onValueChange={onStatusChange} defaultValue="pending">
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortByChange}>
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
