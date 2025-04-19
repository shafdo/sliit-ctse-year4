import jsonwebtoken from 'jsonwebtoken';

export const generateJWT = async (jsonPayload: {}) => {
  const token = await jsonwebtoken.sign(
    jsonPayload,
    process.env.JWT_SECRET ?? 'sdh$@%aj$',
    {
      expiresIn: '1d',
    }
  );

  return token;
};
