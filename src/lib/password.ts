import { hash, compare } from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function comparePasswords(
  plaintext: string,
  hashed: string,
): Promise<boolean> {
  return compare(plaintext, hashed);
}
