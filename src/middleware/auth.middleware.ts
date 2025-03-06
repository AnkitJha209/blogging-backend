import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
    user?: jwt.JwtPayload | string;
}

export const verifyToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(404).json({
                success: false,
                message: "No token Found",
            });
            return;
        }
        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret_key"
        );
        console.log(decode);
        req.user = decode;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            success: false,
            message: "Could not Verify Token",
        });
        return;
    }
};

export const isAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user || typeof req.user === "string") {
            return res.status(403).json({
                success: false,
                message: "Access denied. User not authenticated.",
            });
        }
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only.",
            });
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
        });
    }
};
