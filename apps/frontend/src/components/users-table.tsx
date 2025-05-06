'use client';

import { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Check, Ban, Eye } from 'lucide-react';
import UserService from '@/services/user.service';
import type { User as BaseUser } from '@repo/shared';

type User = Omit<BaseUser, 'location'> & {
  location: string;
}

type filterType = { search: string; status: string; gender: string };

export function UsersTable({ filters }: { filters: filterType }) {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    console.log('Filters changed:', filters.search);
  }, [filters]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      return (
        (filters.status === 'all' || user.status === filters.status) &&
        (filters.gender === 'all' || user.gender === filters.gender) &&
        (
          user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    });
  }, [users, filters]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredUsers.slice(start, start + limit);
  }, [filteredUsers, page, limit]);

  useEffect(() => {
    UserService.getUsers({ page: 1, limit: 10 }).then(({ data, error }) => {
      if (error) {
        console.error('Error fetching users', error);
        return;
      }

      if (error) return;

      setUsers(data);
    });
  }, []);

  const handleSuspendUser = async (userId: string) => {
    const confirm = window.confirm('Are you sure you want to suspend this user?');

    if (!confirm) return;

    const { error } = await UserService.updateUserStatus(userId, 'suspended');

    if (error) return;

    setUsers(prev => prev.map((user) => user.id === userId ? { ...user, status: 'suspended' } : user));

    console.log('Suspended user', userId);
  };

  const handleReinstateUser = async (userId: string) => {
    const confirm = window.confirm('Are you sure you want to reinstate this user?');

    if (!confirm) return;

    const { error } = await UserService.updateUserStatus(userId, 'active');

    if (error) return;

    setUsers(prev => prev.map((user) => user.id === userId ? { ...user, status: 'active' } : user));

    console.log('Reinstated user', userId);
  };

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
          {filteredUsers && filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.photos[0]} alt={user.name} />
                    <AvatarFallback>{user.name[0].toUpperCase() || 'UN'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary'
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.location}</TableCell>
              <TableCell>
                {user.age} / {user.gender}
              </TableCell>
              <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    {/*<DropdownMenuItem>*/}
                    {/*  <Edit className="mr-2 h-4 w-4" />*/}
                    {/*  Edit User*/}
                    {/*</DropdownMenuItem>*/}
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
                    {/*<DropdownMenuItem className="text-destructive">*/}
                    {/*  <Trash className="mr-2 h-4 w-4" />*/}
                    {/*  Delete User*/}
                    {/*</DropdownMenuItem>*/}
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
