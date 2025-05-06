'use client';
import { UserLayout } from '@/components/user-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import mediaService from '@/services/media.service';

export default function UpdateProfilePage() {
  const { user, isLoading, updateUser } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    bio: '',
    interests: '',
    photos: [] as string[],
  });
  const [error, setError] = useState('');

  // Sync formData with user data when the user becomes available
  useEffect(() => {
    if (user && !isLoading) {
      setFormData({
        name: user.name || '',
        age: user.age?.toString() || '',
        location: user.location || '',
        bio: user.bio || '',
        interests: user.interests?.join(', ') || '',
        photos: user.photos || [],
      });
    }
  }, [user, isLoading]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadPhoto = async (file: File) => {
    try {
      const { data, error } = await mediaService.getUploadUrl(file);
      if (error) {
        throw new Error('Failed to get upload URL');
      }

      const { url, key } = data;
      const { error: uploadImageError } = await mediaService.uploadImage(file, url);
      if (uploadImageError) {
        throw new Error('Error uploading image');
      }

      const bucketName = 'i4you-bucket';
      const bucketRegion = 'ap-south-1';
      const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${key}`;

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, imageUrl],
      }));
      setError('');
    } catch (err) {
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

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('User data not available. Please try again.');
      return;
    }

    try {
      const updatedUser = {
        ...user,
        name: formData.name,
        age: parseInt(formData.age) || user.age || 18,
        location: formData.location,
        bio: formData.bio,
        interests: formData.interests
          .split(',')
          .map((interest) => interest.trim())
          .filter((interest) => interest),
        photos: formData.photos,
      };

      await updateUser(updatedUser);
      router.push('/profile');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="w-full max-w-md mx-auto pb-20 pt-6 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
            className="hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-10 rounded-lg transition-all focus:ring-2 focus:ring-teal-500"
                />
              </div>
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
                  required
                  className="h-10 rounded-lg transition-all focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="h-10 rounded-lg transition-all focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  About Me
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={5}
                  className="rounded-lg transition-all focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests" className="text-sm font-medium">
                  Interests (comma-separated)
                </Label>
                <Input
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., hiking, reading, music"
                  className="h-10 rounded-lg transition-all focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg relative group">
                    <img
                      src={photo}
                      alt={`Profile photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute size-6 -top-2 -right-2 bg-red-500 rounded-full opacity-0 p-1 group-hover:opacity-100 transition flex items-center justify-center"
                      aria-label="Delete photo"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                {formData.photos.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-gray-500" />
                  </button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Add up to 6 photos. Profiles with photos get more matches!
              </p>
            </CardContent>
          </Card>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full hover:bg-gray-100 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </UserLayout>
  );
}