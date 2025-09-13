'use client';

import {UserLayout} from '@/components/user-layout';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
    Settings,
    Heart,
    Calendar,
    LogOut,
    Edit,
    MapPin,
    MessageCircle,
    Camera,
    Share2,
    Shield,
    Award,
    Eye,
    BadgeCheck,
} from 'lucide-react';
import {useAuthStore} from '@/store/auth-store';
import {useRouter} from 'next/navigation';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

export default function ProfilePage() {
    const {user, isLoading, logout} = useAuthStore();
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
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="i4you-gradient p-3 rounded-full animate-pulse">
                    <Heart className="h-8 w-8 text-white animate-pulse"/>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-xl font-semibold mb-4">User not found</div>
                <Button onClick={() => router.push('/login')}>Go to Login</Button>
            </div>
        );
    }

    const activities = [
        {type: 'match', name: 'Sarah', time: '2 hours ago'},
        {type: 'like', name: 'Michael', time: '1 day ago'},
        {type: 'view', name: 'Emma', time: '3 days ago'},
    ];

    const subscriptionPlan = user.subscription?.planId || 'basic';

    const planDetails = {
        basic: {
            title: 'Free Member',
            description: 'Basic features',
            buttonText: 'Upgrade to Premium',
            buttonAction: () => router.push('/subscription'),
        },
        plus: {
            title: 'Plus Member',
            description: 'Plus features',
            buttonText: 'Manage Subscription',
            buttonAction: () => router.push('/subscription'),
        },
        premium: {
            title: 'Platinum Member',
            description: 'Platinum features',
            buttonText: 'Manage Subscription',
            buttonAction: () => router.push('/subscription'),
        },
    };

    const currentPlan = planDetails[subscriptionPlan] || planDetails.basic;

    return (
        <UserLayout>
            <div className="max-w-lg mx-auto pb-20 pt-6 px-4">
                {/* Header with profile actions */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => router.push('/settings')}>
                            <Settings className="h-4 w-4"/>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => router.push('/share-profile')}>
                            <Share2 className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>

                {/* Main profile card*/}
                <Card className="mb-6 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-pink-400 to-purple-500 relative"/>

                    <CardContent className="pt-0 relative">
                        <div className="flex flex-col items-center -mt-12 mb-6">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-4 border-background">
                                    <AvatarImage src={user.photos && user.photos[0]} alt={user?.name}/>
                                    <AvatarFallback
                                        className="bg-gradient-to-br from-pink-500 to-orange-400 text-white text-xl">
                                        {user.name &&
                                            user.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {user.verified && (
                                    <BadgeCheck
                                        className="absolute top-1 right-1 rounded-full text-[10px] p-1 bg-blue-50 text-blue-600 border-blue-200 flex items-center"
                                    >
                                        <Shield className="h-4 w-4 mr-0.5"/>
                                    </BadgeCheck>
                                )}
                            </div>

                            <div className="mt-4 text-center">
                                <div className="flex flex-col items-center max-w-xs mx-auto text-center">
                                    <h2 className="text-2xl font-bold break-words">
                                        {user.name}, {user.age}
                                    </h2>
                                </div>

                                <p className="text-muted-foreground flex items-center justify-center mt-1">
                                    <MapPin className="h-3.5 w-3.5 mr-1"/> {user.location}
                                </p>

                                <div className="flex justify-center space-x-2 mt-4">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="i4you-gradient border-none"
                                        onClick={handleEditProfile}
                                    >
                                        <Edit className="h-3.5 w-3.5 mr-2"/>
                                        Edit Profile
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleChangePassword}>
                                        <Shield className="h-3.5 w-3.5 mr-2"/>
                                        Security
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Bio section */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <h3 className="font-medium mb-2 flex items-center">
                                    <MessageCircle className="h-4 w-4 mr-2 text-primary"/>
                                    About Me
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {user.bio || 'Tell others about yourself by adding a bio.'}
                                </p>
                            </div>
                        </div>

                        {/* Interests section */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-3 flex items-center">
                                <Heart className="h-4 w-4 mr-2 text-primary"/>
                                Interests
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.interests && user.interests.length > 0 ? (
                                    user.interests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-primary"
                                        >
                      {interest}
                    </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">Add some interests to help find better
                                        matches.</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Photos grid with improved layout */}
                <Card className="mb-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <Camera className="h-4 w-4 mr-2 text-primary"/>
                            My Photos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-2">
                            {user.photos &&
                                user.photos.map((photo, index) => (
                                    <div key={index}
                                         className="aspect-square relative rounded-md overflow-hidden bg-slate-100 group">
                                        <img
                                            src={photo || '/placeholder.svg'}
                                            alt={`Photo ${index + 1}`}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs for stats and activity */}
                <Tabs defaultValue="stats" className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                        <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stats" className="mt-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full p-3 mb-2">
                                            <Heart className="h-5 w-5 text-pink-500"/>
                                        </div>
                                        <span className="text-lg font-bold">{user.stats?.likes || 0}</span>
                                        <span className="text-xs text-muted-foreground">Likes</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div
                                            className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full p-3 mb-2">
                                            <Heart className="h-5 w-5 text-purple-500 fill-purple-500"/>
                                        </div>
                                        <span className="text-lg font-bold">{user.stats?.matches || 0}</span>
                                        <span className="text-xs text-muted-foreground">Matches</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div
                                            className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-3 mb-2">
                                            <Calendar className="h-5 w-5 text-blue-500"/>
                                        </div>
                                        <span className="text-lg font-bold">{user.stats?.activeDays || 0}</span>
                                        <span className="text-xs text-muted-foreground">Days</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="activity" className="mt-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {activities.map((activity, index) => (
                                        <div key={index}
                                             className="flex items-center gap-3 pb-3 border-b last:border-0">
                                            <div
                                                className={`rounded-full p-2 
                        ${
                                                    activity.type === 'match'
                                                        ? 'bg-pink-100'
                                                        : activity.type === 'like'
                                                            ? 'bg-purple-100'
                                                            : 'bg-blue-100'
                                                }`}
                                            >
                                                {activity.type === 'match' ? (
                                                    <Heart className="h-4 w-4 text-pink-500 fill-pink-500"/>
                                                ) : activity.type === 'like' ? (
                                                    <Heart className="h-4 w-4 text-purple-500"/>
                                                ) : (
                                                    <Eye className="h-4 w-4 text-blue-500"/>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {activity.type === 'match'
                                                        ? 'You matched with '
                                                        : activity.type === 'like'
                                                            ? 'You liked '
                                                            : 'You viewed '}
                                                    <span className="font-semibold">{activity.name}</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Social connections */}
                {/*<Card className="mb-6">*/}
                {/*  <CardHeader className="pb-2">*/}
                {/*    <CardTitle className="text-lg flex items-center">*/}
                {/*      <Gift className="h-4 w-4 mr-2 text-primary" />*/}
                {/*      Connect More*/}
                {/*    </CardTitle>*/}
                {/*  </CardHeader>*/}
                {/*  <CardContent>*/}
                {/*    <div className="grid grid-cols-3 gap-3">*/}
                {/*      <Button variant="outline" className="flex flex-col h-auto py-3">*/}
                {/*        <Instagram className="h-5 w-5 mb-1 text-pink-500" />*/}
                {/*        <span className="text-xs">Instagram</span>*/}
                {/*      </Button>*/}
                {/*      <Button variant="outline" className="flex flex-col h-auto py-3">*/}
                {/*        <Facebook className="h-5 w-5 mb-1 text-blue-600" />*/}
                {/*        <span className="text-xs">Facebook</span>*/}
                {/*      </Button>*/}
                {/*      <Button variant="outline" className="flex flex-col h-auto py-3">*/}
                {/*        <Twitter className="h-5 w-5 mb-1 text-blue-400" />*/}
                {/*        <span className="text-xs">Twitter</span>*/}
                {/*      </Button>*/}
                {/*    </div>*/}
                {/*  </CardContent>*/}
                {/*</Card>*/}

                {/* Membership card */}
                <Card className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{currentPlan.title}</h3>
                                <p className="text-sm text-white/80">{currentPlan.description}</p>
                            </div>
                            <Award className="h-8 w-8"/>
                        </div>
                        <Button
                            variant="secondary"
                            className="w-full bg-white text-primary hover:bg-white/90"
                            onClick={currentPlan.buttonAction}
                        >
                            {currentPlan.buttonText}
                        </Button>
                    </CardContent>
                </Card>

                {/* Sign out button */}
                <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4 mr-2"/>
                    Sign Out
                </Button>
            </div>
        </UserLayout>
    );
}
