import React from 'react';
import AuthSessionHydrator from '@/components/auth/auth-session-hydrator';
import { getUserData } from '@/lib/auth/get-user-data';
import { redirect } from 'next/navigation';

export default async function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  // const user = {
  //   id: '123',
  //   name: 'John Doe',
  //   email: 'example@gmail.com',
  //   role: 'member',
  //   age: 30,
  //   bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //   image: 'https://example.com/image.jpg',
  //   photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
  //   location: 'London, UK',
  //   status: 'active' as 'active' | 'suspended',
  // };

  const user = await getUserData();

  if (user && user.role === 'admin') {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <AuthSessionHydrator user={user} />
      {children}
    </div>
  );
}
