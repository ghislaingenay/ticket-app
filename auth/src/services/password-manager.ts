import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
// for hashing, could use npm packages like argon or bcrypt

export class PasswordManager {
  //  Static means that we can use Password.toHash() or Password.compare()
  // Don't need to create a new instance of it  like const newPassword = new Password()
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedpassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedpassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
