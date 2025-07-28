import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => parseInt(val) >= 18, { message: 'You must be at least 18 years old' }),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
  location: z.object({
    displayName: z.string().min(1, 'Location is required'),
    coordinates: z
      .array(z.number())
      .length(2, 'Coordinates must include latitude and longitude'),
  }),
  bio: z.string().min(10, 'Bio must be min 10 characters').max(500, 'Bio must be under 500 characters').optional(),
  photos: z.array(z.string()).min(2, 'Min of 2 photos is required').max(6, 'You can upload up to 6 photos only'),
  interests: z
    .array(z.string()).min(5, 'At least 5 interests are required')
    .max(12, 'Maximum 12 interests allowed'),
});