'use client';
import { UserLayout } from '@/components/user-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Heart, Calendar, LogOut, Edit } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuthStore();

  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleEditProfile = () => {
    router.push('/update-profile');
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <UserLayout>
      <div className="max-w-lg mx-auto pb-20 pt-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.photos && user.photos[0]} alt={user?.name} />
                <AvatarFallback>
                  {user.name && user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-xl font-bold">
                {user.name}, {user.age}
              </h2>
              <p className="text-muted-foreground">{user.location}</p>

              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="sm" className="mt-2"
                        onClick={handleChangePassword}>
                  <Edit className="h-3 w-3 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" size="sm" className="mt-2"
                        onClick={handleEditProfile}>
                  <Edit className="h-3 w-3 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">About Me</h3>
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests && user.interests.map((interest, index) => (
                    <span key={index}
                          className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">My Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {user.photos && user.photos.map((photo, index) => (
                <div key={index}
                     className="aspect-square relative rounded-md overflow-hidden bg-slate-100">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-slate-100 rounded-full p-3 mb-2">
                  <Heart className="h-5 w-5 text-teal-500" />
                </div>
                <span className="text-lg font-bold">{user.stats && user.stats.likes}</span>
                <span className="text-xs text-muted-foreground">Likes</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-slate-100 rounded-full p-3 mb-2">
                  <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                </div>
                <span className="text-lg font-bold">{user.stats && user.stats.matches}</span>
                <span className="text-xs text-muted-foreground">Matches</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-slate-100 rounded-full p-3 mb-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-lg font-bold">{user.stats && user.stats.activeDays}</span>
                <span className="text-xs text-muted-foreground">Days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full text-red-500 hover:text-red-600" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </UserLayout>
  );
}
