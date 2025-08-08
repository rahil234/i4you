'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import adminService from '@/services/admin.service';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageModerationItem {
  id: string;
  publicId: string;
  date: string;
  image: string;
  status: 'approved' | 'rejected' | 'pending';
}

interface Props {
  status: 'approved' | 'rejected' | 'pending';
  sortBy?: 'createdAt' | 'updatedAt';
}

export function ImageModerationQueue({ status }: Props) {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery<ImageModerationItem[], Error>({
    queryKey: ['moderation-images', status],
    queryFn: async () => {
      const { data, error } = await adminService.getModerationImages({
        status,
      });
      if (error) throw new Error('Failed to fetch moderation images');
      return data || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: 'approved' | 'rejected' }) => {
      await adminService.updateModerationStatus(id, newStatus);
    },
    onSuccess: () => {
      setTimeout(async () => {
        await queryClient.invalidateQueries({ queryKey: ['moderation-images', status] });
      }, 2000);
    },
    onError: (error) => {
      console.error('Moderation update error:', error);
    },
  });

  const handleApprove = (id: string) => {
    mutation.mutate({ id, newStatus: 'approved' });
  };

  const handleReject = (id: string) => {
    mutation.mutate({ id, newStatus: 'rejected' });
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-60 w-full rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-80 justify-center items-center text-center text-gray-500">
        No images.
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading moderation images. Please try again.
      </div>
    );
  }

  return (
    <div className="grid gap-4  lg:grid-cols-4 md:grid-cols-2 mt-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="rounded-md border">
                <img
                  src={item.image || '/placeholder.svg'}
                  alt="Content for review"
                  className="rounded-md min-h-20"
                />
              </div>
              <div className="flex gap-2">
                {item.status !== 'rejected' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleReject(item.publicId)}
                    disabled={mutation.isPending}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                )}
                {item.status !== 'approved' && (
                  <Button
                    className="flex-1"
                    onClick={() => handleApprove(item.publicId)}
                    disabled={mutation.isPending}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
