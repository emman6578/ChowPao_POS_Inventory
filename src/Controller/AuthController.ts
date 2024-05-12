import { PrismaClient, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { generateEmailToken } from "../Config/Token/generateEmailToken";
import { generateAuthToken } from "../Config/Token/generateAPIToken";
import { sendEmail } from "../Config/Email/sendEmail";
import { successHandler } from "../Middleware/ErrorHandler";
import expressAsyncHandler from "express-async-handler";
import { UserInterface } from "../Interface/UserInterfaceRequest";

const prisma = new PrismaClient();
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const API_TOKEN_EXPIRATION_HOURS = 12;

export const register = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user: UserInterface = req.body;

    const createUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
      },
      include: {
        Cart: true,
      },
    });

    if (!createUser) {
      throw new Error("Error creating user");
    }

    const cart = await prisma.cart.create({
      data: {
        user: {
          connect: {
            id: createUser.id,
          },
        },
      },
    });

    if (!cart) {
      throw new Error("Error creating user's cart");
    }

    res.json(createUser);
  }
);

export const createToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user: UserInterface = req.body;

    //Generate token and set expiration
    const emailToken = generateEmailToken();
    const expiration = new Date(
      new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
    );

    const checkEmail = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!checkEmail) {
      throw new Error("Please register first");
    }

    const createdTokenEmail = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connect: { email: user.email },
        },
      },
    });

    successHandler(createdTokenEmail, res);

    const data = {
      to: user.email,
      text: "Password Code",
      subject: "Login Code",
      htm: `This code <h1>${createdTokenEmail.emailToken}</h1> will expire in ${EMAIL_TOKEN_EXPIRATION_MINUTES} mins`,
    };

    sendEmail(data);
  }
);

export const authToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, emailToken } = req.body;

    const dbEmailToken = await prisma.token.findUnique({
      where: { emailToken },
      include: { user: true },
    });

    if (!dbEmailToken || !dbEmailToken?.valid) {
      throw new Error("Unathorized Access");
    }

    if (dbEmailToken!.expiration < new Date()) {
      throw new Error("Unathorized Access: Token expired");
    }

    if (dbEmailToken?.user?.email !== email) {
      throw new Error("Unathorized Access");
    }

    const expiration = new Date(
      new Date().getTime() + API_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000
    );

    const apiToken = await prisma.token.create({
      data: {
        type: "API",
        expiration,
        user: { connect: { email } },
      },
    });

    await prisma.token.update({
      where: {
        id: dbEmailToken?.id,
      },
      data: {
        valid: false,
      },
    });

    const authToken = generateAuthToken(apiToken.id);

    res.json({ authToken });
  }
);
