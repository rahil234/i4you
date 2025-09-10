'use client';

import { UserLayout } from '@/components/user-layout';
import type React from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Sun, Moon, Laptop } from 'lucide-react';

import { useTheme } from '@/context/theme-context';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();


  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <UserLayout>
      <div className="w-full max-w-md mx-auto pb-20 pt-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button variant="outline" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="mb-1">Theme</Label>
          <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="light" value="light" />
              <Label htmlFor="light" className="flex items-center gap-1">
                <Sun className="h-4 w-4" />
                Light
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="dark" value="dark" />
              <Label htmlFor="dark" className="flex items-center gap-1">
                <Moon className="h-4 w-4" />
                Dark
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="system" value="system" />
              <Label htmlFor="system" className="flex items-center gap-1">
                <Laptop className="h-4 w-4" />
                System
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </UserLayout>
  );
}