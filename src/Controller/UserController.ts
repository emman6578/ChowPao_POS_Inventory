import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();

//get all user
//get single user
//update user
//delete user
