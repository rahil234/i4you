'use client';
import { UserLayout } from '@/components/user-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import UserService from '@/services/user.service';

export default function ChangePasswordPage() {
  const { isLoading } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Mock updatePassword function (replace with actual implementation)
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    console.log('Updating password:', { currentPassword, newPassword });

    const { error } = await UserService.changePassword({ newPassword, currentPassword });

    if (error) {
      setError((error as any).message);
    }

    setSuccess('Password updated successfully');

  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error when user types
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validateForm = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    let isValid = true;

    // Current password validation
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    // New password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (!passwordRegex.test(formData.newPassword)) {
      errors.newPassword =
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await updatePassword(formData.currentPassword, formData.newPassword);
      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold">Change Password</h1>
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
              <CardTitle className="text-xl font-semibold">Update Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="h-10 rounded-lg transition-all focus:ring-2 focus:ring-teal-500"
                />
                {fieldErrors.currentPassword && (
                  <p className="text-red-500 text-xs">{fieldErrors.currentPassword}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="h-10 rounded-lg transition-all focus:ring-2 focus:ring-teal-500"
                />
                {fieldErrors.newPassword && (
                  <p className="text-red-500 text-xs">{fieldErrors.newPassword}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="h-10 rounded-lg transition-all focus:ring-2 focus:ring-teal-500"
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-red-500 text-xs">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          {success && (
            <p className="text-green-500 text-sm bg-green-50 p-3 rounded-lg">{success}</p>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white transition-colors"
            >
              <Lock className="h-4 w-4 mr-2" />
              Update Password
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