'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: { search: string; status: string; gender: 'all' | 'male' | 'female' | 'other' }) => void;
}

export function UsersFilter({ onFilterChange }: FilterProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [gender, setGender] = useState<'all' | 'male' | 'female' | 'other'>('all');

  useEffect(() => {
    onFilterChange({ search, status, gender });
  }, [search, status, gender]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select defaultValue="all" onValueChange={(value) => {
          setStatus(value);
        }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all" onValueChange={(value) => {
          setGender(value as 'all' | 'male' | 'female' | 'other');
        }}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
