import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

type AuthRequest = Request & { user?: User };

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];

  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }

  //decode jwt token
  try {
    const payload = (await jwt.verify(token, JWT_SECRET!)) as {
      tokenId: string;
    };
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      res.sendStatus(401).json({ error: "API token not valid or expired" });
    }

    req.user = dbToken?.user;
  } catch (error) {
    return res.sendStatus(401);
  }
  next();
}
