import response from "@/utils/response";
import { createUserRepo, findUserByFilter } from "@/repository/user.repository";
import { Request, Response } from "express";
import { compareHash, hashText } from "@/utils/bcrypt";
import { generateJWT } from "@/utils/jwt";

export const createUser = async (req: Request, res: Response) => {
  // Hash password
  req.body.password = hashText(req.body.password);

  const info = await createUserRepo({ ...req.body });

  // Remove password
  if (info.data?.password) {
    delete info.data.password;
  }

  return response({
    res,
    status: info.status,
    message: info.message,
    data: info.data,
  });
};

export const login = async (req: Request, res: Response) => {
  const userData = await findUserByFilter({
    email: req.body.email,
    role: req.body.role,
  });

  // User not exist check. User password not match check.
  if (
    !userData ||
    (userData && !compareHash(req.body.password, userData.password))
  ) {
    return response({
      res,
      status: 401,
      message: "Invalid username or password",
    });
  }

  if (userData.role !== req.body.role) {
    return res.status(401).json({ data: "Invalid role" });
  }

  // Generate auth token
  const authToken = await generateJWT({
    uid: userData._id,
    username: userData.username,
    email: userData.email,
    role: userData.role,
  });

  // Append auth cookie
  res.cookie("auth", authToken, {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    sameSite: "lax",
  });
  return response({
    res,
    message: "Logged in successfully.",
  });
};
