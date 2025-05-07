import { z } from 'zod';

// Zod schema for register request
export const registerRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Types inferred from the schema
export type RegisterRequestDTO = z.infer<typeof registerRequestSchema>;

export class RegisterRequest {
  public name: string;
  public email: string;
  public password: string;

  constructor(private readonly data: RegisterRequestDTO) {
    console.log(data);
    registerRequestSchema.parse(data);
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }
}

// Response schema and type
export const registerResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
});

export type RegisterResponseDTO = z.infer<typeof registerResponseSchema>;

export class RegisterResponse {
  constructor(private readonly data: RegisterResponseDTO) {
    // Validate data against schema
    registerResponseSchema.parse(data);
  }

  toString(): string {
    return `Token: ${this.data.accessToken}, User: ${this.data.user.name} (${this.data.user.email})`;
  }
}
