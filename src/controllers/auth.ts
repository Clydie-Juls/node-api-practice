import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db";

const encryptPassword = async (password: String) => {
  return await bcrypt.hash(password, 5);
};

const decryptPassword = (password: String, hash: String) => {
  return bcrypt.compare(password, hash);
};

const createJwtAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, user: user.username },
    process.env.JWT_ACCESS_TOKEN_SECRET
  );
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).send("Not authorized");
  }

  const token = bearer.split(" ")[1];
  if (!token) {
    return res.status(401).send("Not authorized");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    req["user"] = payload;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send("Invalid Access token");
  }
};

export const login = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { username: req.body.username },
  });

  if (!user) {
    return res.status(401).send("Empty username input");
  }

  const valid = decryptPassword(req.body.password, user.password);
  if (!valid) {
    return res.status(401).send("Invalid username or password");
  }

  res.status(201).json({ accessToken: createJwtAccessToken(user) });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).send("Missing username or password.");
    }

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await encryptPassword(req.body.password),
      },
    });

    res.status(201).json({ accessToken: createJwtAccessToken(user) });
  } catch (err) {
    err.type = "input";
    next(err);
  }
};
