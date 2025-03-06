import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const client = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(404).json({
                success: false,
                message: "Need all the Information",
            });
            return;
        }
        if (username.length < 5 || password.length < 6) {
            res.status(401).json({
                success: false,
                message:
                    "Username should have minimum 5 words & Password should contain minimum 6 words",
            });
            return;
        }
        const user = await client.user.findFirst({
            where: {
                username,
            },
        });
        if (user) {
            res.status(402).json({
                success: false,
                message: "Username Already Exist",
            });
            return;
        }
        const emailExist = await client.user.findFirst({
            where: {
                email,
            },
        });
        if (emailExist) {
            res.status(402).json({
                success: false,
                message: "Email Already Exist",
            });
            return;
        }

        const hashPass = await bcrypt.hash(password, 11);
        await client.user.create({
            data: {
                username,
                password: hashPass,
                email,
            },
        });
        res.status(200).json({
            success: true,
            message: "User Created Successfully",
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error while Creating User",
        });
        return;
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(404).json({
                success: false,
                message: "All the fields are required",
            });
            return;
        }
        const userExist = await client.user.findFirst({
            where: {
                email,
            },
        });
        if (!userExist) {
            res.status(401).json({
                success: false,
                message: "User Does not exist",
            });
            return;
        }
        if (await bcrypt.compare(password, userExist.password)) {
            const payload = {
                id: userExist.id,
                role: userExist.role,
            };
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || "secret_key",
                {
                    expiresIn: "1h",
                }
            );
            res.status(200).json({
                success: true,
                message: "Successfully Logged In",
                token,
            });
            return;
        } else {
            res.status(403).json({
                success: false,
                message: "Password is not correct",
            });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error while Signing Up",
        });
        return;
    }
};
