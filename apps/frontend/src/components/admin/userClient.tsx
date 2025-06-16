// components/UsersClient.tsx
'use client';

import { useState } from 'react';
import { UsersTable } from '@/components/users-table';
import { UsersFilter } from '@/components/users-filter';

type Filters = {
  search: string
  status: string
  gender: 'all' | 'male' | 'female' | 'other'
}

export default function UsersClient() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    gender: 'all',
  });

  const handleFilterChange = (filters: Filters) => {
    setFilters(filters);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      <UsersFilter onFilterChange={handleFilterChange} />
      <UsersTable filters={filters} />
    </div>
  );
}