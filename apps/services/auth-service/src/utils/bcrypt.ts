import bcrypt from 'bcryptjs';

// Number of salt rounds for hashing (higher = more secure but slower)
const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(
      `Password hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Compares a plain text password with a hashed password
 * @param password Plain text password
 * @param hash Hashed password
 * @returns Boolean indicating if they match
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error(
      `Password comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
