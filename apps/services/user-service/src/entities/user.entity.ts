import { User as IUser } from '@i4you/shared';

export class User implements Omit<IUser, 'photos' | 'role'> {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public age: number,
    public gender: 'male' | 'female' | 'other',
    public bio: string,
    public interests: string[],
    public preferences: {
      ageRange: [number, number];
      distance: number;
      showMe: 'male' | 'female' | 'all';
      lookingFor: 'casual' | 'relationship' | 'friendship' | 'all';
    },
    public location: {
      type: 'Point';
      coordinates: [number, number];
      displayName: string;
    },
    public onboardingCompleted: boolean = false,
    public status: 'active' | 'suspended' = 'active',
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
