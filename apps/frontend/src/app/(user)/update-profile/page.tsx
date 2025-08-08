'use client';

import { UserLayout } from '@/components/user-layout';
import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, useEffect } from 'react';
import { Save, ArrowLeft, X, Camera, User as UserIcon, Info, Heart, Settings2 } from 'lucide-react';
import mediaService from '@/services/media.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LocationInput } from '@/components/location/location-input';
import { User } from '@i4you/shared';
import { profileSchema } from '@/schemas/profile-schema';
import { Slider } from '@/components/ui/slider';


const interestCategories = [
  {
    name: 'Lifestyle',
    interests: ['Travel', 'Fitness', 'Cooking', 'Reading', 'Photography', 'Art', 'Music', 'Dancing', 'Yoga', 'Hiking'],
  },
  {
    name: 'Sports',
    interests: [
      'Football',
      'Basketball',
      'Tennis',
      'Swimming',
      'Cycling',
      'Running',
      'Golf',
      'Volleyball',
      'Skiing',
      'Surfing',
    ],
  },
  {
    name: 'Entertainment',
    interests: [
      'Movies',
      'TV Shows',
      'Gaming',
      'Concerts',
      'Theater',
      'Comedy',
      'Festivals',
      'Board Games',
      'Podcasts',
      'Anime',
    ],
  },
  {
    name: 'Food & Drink',
    interests: ['Coffee', 'Wine', 'Foodie', 'Vegan', 'Craft Beer', 'Brunch', 'Baking', 'BBQ', 'Sushi', 'Cocktails'],
  },
];

export default function UpdateProfilePage() {
  const { user, isLoading, updateUser } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: {} as User['location'],
    bio: '',
    gender: '',
    photos: [] as string[],
    preferences: {
      showMe: '',
      lookingFor: '',
      ageRange: [18, 99],
      distance: 50,
    },
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && !isLoading) {
      setFormData({
        name: user.name || '',
        age: user.age?.toString() || '',
        location: {
          type: 'Point',
          coordinates: [0, 0],
          displayName: user.location ? user.location : '',
        },
        bio: user.bio || '',
        gender: user.gender || '',
        photos: user.photos || [],
        preferences: {
          showMe: user.preferences?.showMe || '',
          lookingFor: user.preferences?.lookingFor || '',
          ageRange: user.preferences?.ageRange || [18, 99],
          distance: user.preferences?.distance || 50,
        },
      });

      setSelectedInterests(user.interests || []);
    }
  }, [user, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (location: Omit<User['location'], 'type'>) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: location.coordinates,
        displayName: location.displayName,
      },
    }));
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      if (selectedInterests.length < 12) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  const uploadPhoto = async (file: File) => {
    try {
      setError('');

      const tempId = Date.now().toString();
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, `loading-${tempId}`],
      }));

      const { data, error } = await mediaService.getUploadUrl(file);
      if (error) throw new Error('Failed to get upload URL');

      const { url, fields } = data;

      const { data: uploaded, error: uploadImageError } = await mediaService.uploadImage(
        file,
        url,
        fields,
      );
      if (uploadImageError) throw new Error('Error uploading image');

      const imageUrl = uploaded.secure_url;

      setFormData((prev) => ({
        ...prev,
        photos: prev.photos.map((p) => (p === `loading-${tempId}` ? imageUrl : p)),
      }));
    } catch (err) {
      setFormData((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => !p.startsWith('loading-')),
      }));
      setError('Failed to upload photo. Please try again.');
    }
  };

  const handleAddPhoto = async () => {
    if (formData.photos.length >= 6) {
      setError('Maximum 6 photos allowed');
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async () => {
      if (fileInput.files && fileInput.files[0]) {
        await uploadPhoto(fileInput.files[0]);
      }
    };
    fileInput.click();
  };

  const handleRemovePhoto = async (index: number) => {
    const photoToDelete = formData.photos[index];
    const { error } = await mediaService.deleteImage(photoToDelete);
    if (error) {
      setError('Failed to delete photo. Please try again.');
      return;
    }
    setFormData((prev) => {
      const newPhotos = prev.photos.filter((_, i) => i !== index);
      return {
        ...prev,
        photos: newPhotos,
      };
    });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!user) {
      setError('User data not available. Please try again.');
      setIsSubmitting(false);
      return;
    }

    const safeData = {
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      bio: formData.bio,
      location: formData.location,
      photos: formData.photos.filter((p) => !p.startsWith('loading-')),
      interests: selectedInterests,
      preferences: formData.preferences,
    };

    const result = profileSchema.safeParse(safeData);

    if (!result.success) {
      setError(result.error.errors[0].message);
      console.log('Validation errors:', result.error.errors);
      const errorMap: Record<string, string> = {};
      for (const err of result.error.errors) {
        if (err.path[0]) errorMap[err.path[0]] = err.message;
      }
      setFieldErrors(errorMap);
      setIsSubmitting(false);
      return;
    }

    try {
      await updateUser({
        ...user,
        ...result.data,
        age: parseInt(result.data.age),
        location: {
          type: 'Point',
          coordinates: result.data.location.coordinates as [number, number],
          displayName: result.data.location.displayName,
        },
      });
      router.push('/profile');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="i4you-gradient p-3 rounded-full">
          <Heart className="h-6 w-6 text-white animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="w-full max-w-md mx-auto pb-20 pt-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-black">Edit Profile</h1>
          <Button variant="outline" size="icon" onClick={handleCancel} className="hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-1">
              <UserIcon className="h-3.5 w-3.5" />
              <span>Basic</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-1">
              <Settings2 className="h-3.5 w-3.5" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="interests" className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>Interests</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-1">
              <Camera className="h-3.5 w-3.5" />
              <span>Photos</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TabsContent value="basic">
              <Card className="shadow-sm border border-gray-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-11 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">
                      Age
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="18"
                      className="h-11 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    {fieldErrors.age && <p className="text-sm text-red-500">{fieldErrors.age}</p>}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                    {fieldErrors.gender && <p className="text-sm text-red-500">{fieldErrors.gender}</p>}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <LocationInput
                      name="location"
                      value={formData.location.displayName}
                      onChange={(val) => handleLocationChange(val)}
                    />
                    {fieldErrors.location && <p className="text-sm text-red-500">{fieldErrors.location}</p>}
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium flex items-center">
                      <Info className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      About Me
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-primary resize-none"
                      placeholder="Tell others about yourself..."
                    />
                    <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/500 characters</p>
                    {fieldErrors.bio && <p className="text-sm text-red-500">{fieldErrors.bio}</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="shadow-sm border border-gray-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Settings2 className="h-4 w-4 mr-2 text-primary" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-6">
                    {/* Show Me */}
                    <div className="space-y-2">
                      <Label htmlFor="showMe">Show Me</Label>
                      <RadioGroup
                        id="showMe"
                        name="showMe"
                        value={formData.preferences.showMe}
                        onValueChange={(value) => setFormData((prev) => ({
                          ...prev,
                          preferences: { ...prev.preferences, showMe: value },
                        }))}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all" />
                          <Label htmlFor="all">Everyone</Label>
                        </div>
                      </RadioGroup>
                      {fieldErrors['preferences.showMe'] && (
                        <p className="text-sm text-red-500">{fieldErrors['preferences.showMe']}</p>
                      )}
                    </div>

                    {/* Looking For */}
                    <div className="space-y-2">
                      <Label htmlFor="lookingFor">Looking For</Label>
                      <RadioGroup
                        id="lookingFor"
                        name="lookingFor"
                        value={formData.preferences.lookingFor}
                        onValueChange={(value) => setFormData((prev) => ({
                          ...prev,
                          preferences: { ...prev.preferences, lookingFor: value },
                        }))}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all" />
                          <Label htmlFor="all">All</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="casual" id="casual" />
                          <Label htmlFor="casual">Casual</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="relationship" id="relationship" />
                          <Label htmlFor="relationship">Relationship</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="friendship" id="friendship" />
                          <Label htmlFor="friendship">Friendship</Label>
                        </div>
                      </RadioGroup>
                      {fieldErrors['preferences.lookingFor'] && (
                        <p className="text-sm text-red-500">{fieldErrors['preferences.lookingFor']}</p>
                      )}
                    </div>

                    {/* Age Range */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Age range</Label>
                        <span className="text-sm text-muted-foreground">
                          {formData.preferences.ageRange[0]} - {formData.preferences.ageRange[1]}
                        </span>
                      </div>
                      <Slider
                        defaultValue={formData.preferences.ageRange}
                        min={18}
                        max={60}
                        step={1}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              ageRange: value as [number, number],
                            },
                          }))
                        }
                      />
                      {fieldErrors['preferences.ageRange'] && (
                        <p className="text-sm text-red-500">{fieldErrors['preferences.ageRange']}</p>
                      )}
                    </div>

                    {/* Distance */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Maximum distance</Label>
                        <span
                          className="text-sm text-muted-foreground">{formData.preferences.distance} killometers</span>
                      </div>
                      <Slider
                        defaultValue={[formData.preferences.distance]}
                        min={10}
                        max={4000}
                        step={10}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              distance: value[0],
                            },
                          }))
                        }
                      />
                      {fieldErrors['preferences.distance'] && (
                        <p className="text-sm text-red-500">{fieldErrors['preferences.distance']}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interests">
              <Card className="shadow-sm border border-gray-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-primary" />
                    Your Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    Select up to 12 interests to help us find your perfect match
                  </p>
                  <p className="text-sm text-primary mb-6">{selectedInterests.length}/12 selected</p>

                  <div className="space-y-6">
                    {interestCategories.map((category) => (
                      <div key={category.name}>
                        <h2 className="font-semibold mb-2">{category.name}</h2>
                        <div className="flex flex-wrap gap-2">
                          {category.interests.map((interest) => (
                            <button
                              type="button"
                              key={interest}
                              onClick={() => toggleInterest(interest)}
                              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                selectedInterests.includes(interest)
                                  ? 'bg-primary text-white'
                                  : 'bg-muted hover:bg-muted/80'
                              }`}
                              disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 12}
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos">
              <Card className="shadow-sm border border-gray-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Camera className="h-4 w-4 mr-2 text-primary" />
                    Profile Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg relative group">
                        {photo.startsWith('loading-') ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                            <div
                              className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-primary"></div>
                          </div>
                        ) : (
                          <>
                            <img
                              src={photo || '/placeholder.svg'}
                              alt={`Profile photo ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(index)}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Delete photo"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}

                    {formData.photos.length < 6 && (
                      <button
                        type="button"
                        onClick={handleAddPhoto}
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Add Photo</span>
                      </button>
                    )}
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Photo tips:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Clear face photos get more matches</li>
                        <li>Show your interests and personality</li>
                        <li>Include at least 3 photos for best results</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex gap-4 pt-2">
              <Button
                type="submit"
                className="w-full py-6 i4you-gradient hover:opacity-90 transition-opacity text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div
                      className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-current mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-1/3 py-6 hover:bg-gray-50 transition-colors"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Tabs>
        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
      </div>
    </UserLayout>
  );
}
