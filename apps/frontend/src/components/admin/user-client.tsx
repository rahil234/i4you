'use client';

import { useState } from 'react';
import { UsersTable } from '@/components/users-table';
import { UsersFilter } from '@/components/users-filter';
import {
  Pagination,
  PaginationContent, PaginationEllipsis,
  PaginationItem,
  PaginationLink, PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleFilterChange = (filters: Filters) => {
    setFilters(filters);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      <UsersFilter onFilterChange={handleFilterChange} />
      <UsersTable filters={filters} page={page} setTotalPages={setTotalPages} />
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.max(prev - 1, 1));
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.min(prev + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}