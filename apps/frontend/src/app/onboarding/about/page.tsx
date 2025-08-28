'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { OnboardingLayout } from '@/components/onboarding-layout';
import { useOnboardingStore } from '@/store/onboarding-store';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useAuthStore from '@/store/auth-store';
import { useEffect } from 'react';

export default function OnboardingAbout() {
  const { user } = useAuthStore();
  const { data, setName, setAge, setGender, setBio } = useOnboardingStore();
  const { name, age, bio, gender } = data;

  useEffect(() => {
    if (user)
      setName(user.name || '');
  }, []);

  return (
    <OnboardingLayout currentStep="about">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">About you</h1>
        <p className="text-muted-foreground mb-6">Tell us a bit about yourself to help others get to know you</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="120"
              value={age || ''}
              onChange={(e) => setAge(Number.parseInt(e.target.value, 10) || 0)}
              placeholder="Your age"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup value={gender || ''} onValueChange={setGender} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">
                  Female
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">{bio.length}/500 characters</p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
