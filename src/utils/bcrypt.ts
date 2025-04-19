import bcrypt from 'bcryptjs';

export const hashText = (plainText: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainText, salt);
};

export const compareHash = (plaintext: string, hash: string) => {
  return bcrypt.compareSync(plaintext, hash);
};
