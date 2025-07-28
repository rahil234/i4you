'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Ban, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import UserService from '@/services/user.service';
import type { User as BaseUser } from '@i4you/shared';
import { useEffect } from 'react';

type User = Omit<BaseUser, 'location'> & { location: string };
export type FilterType = { search: string; status: string; gender: string };

export function UsersTable({ filters, page, setTotalPages }: { filters: FilterType; page: number; setTotalPages: (total: number) => void }) {
  const limit = 10;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', filters, page],
    queryFn: () => UserService.getUsers({ filters, page, limit }).then((res) => res.data),
  });

  const users = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    if (data?.totalPages) setTotalPages(data.totalPages);
  }, [data]);

  const handleSuspendUser = async (userId: string) => {
    if (!window.confirm('Suspend this user?')) return;
    const { error } = await UserService.updateUserStatus(userId, 'suspended');
    if (!error) refetch();
  };

  const handleReinstateUser = async (userId: string) => {
    if (!window.confirm('Reinstate this user?')) return;
    const { error } = await UserService.updateUserStatus(userId, 'active');
    if (!error) refetch();
  };

  if (isLoading) return <p className="p-4">Loading users...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading users</p>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Age/Gender</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.photos[0]} alt={user.name} />
                    <AvatarFallback>{user.name[0]?.toUpperCase() || 'UN'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.location}</TableCell>
              <TableCell>{user.age} / {user.gender}</TableCell>
              <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    {user.status === 'suspended' ? (
                      <DropdownMenuItem onClick={() => handleReinstateUser(user.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        Reinstate User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
