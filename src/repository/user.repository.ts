import { User } from '@/models';

export const createUserRepo = async (UserSchema: any) => {
  try {
    const user = await new User(UserSchema).save();
    return {
      status: 200,
      message: 'User created successfully...',
      data: user.toObject(),
    };
  } catch (error: any) {
    return {
      status: 400,
      message: error.message,
    };
  }
};

export const updateUserRepo = async (uid: string, data: any) => {
  try {
    const user = await User.updateOne({ _id: uid }, { $set: data });

    if (user.nModified === 0) {
      return {
        status: 404,
        message: 'User not found...',
        data: null,
      };
    }

    return {
      status: 200,
      message: 'User updated successfully...',
      data: user,
    };
  } catch (error) {
    return {
      status: 400,
      message: error.message,
    };
  }
};

export const getUserRepo = async (uid: string) => {
  try {
    const user = await User.findById(uid).select('-password');
    return {
      status: 200,
      data: user,
    };
  } catch (error) {
    return {
      status: 400,
      message: error.message,
    };
  }
};

export const getUsersRepo = async (filter: {}, isPasswordVisible = false) => {
  const user = User.find(filter);
  if (!isPasswordVisible) {
    return user.select('-password');
  }
  return user;
};

export const findUserByFilter = async (filter: object) => {
  const user = await User.findOne(filter);
  return user;
};
