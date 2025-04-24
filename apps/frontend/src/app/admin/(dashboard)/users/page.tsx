import { UsersTable } from '@/components/users-table';
import { UsersFilter } from '@/components/users-filter';

export default async function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      <UsersFilter />
      <UsersTable />
    </div>
  );
}

