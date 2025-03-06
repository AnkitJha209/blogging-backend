import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Prisma, PrismaClient } from "@prisma/client";

interface UserPayload extends jwt.JwtPayload {
    id: number;
    role: string;
}
interface AuthRequest extends Request {
    user?: UserPayload;
}
const client = new PrismaClient();
export const createBlog = async (req: AuthRequest, res: Response) => {
    try {
        const decode = req.user;
        const { blogTitle, blogDesc } = req.body;
        if (!decode) {
            res.status(404).json({
                success: false,
                message: "Token is not valid",
            });
            return;
        }
        if (!blogTitle || !blogDesc) {
            res.status(403).json({
                success: false,
                message: "Every Feild is required",
            });
            return;
        }
        const blog = await client.blog.create({
            data: {
                blogTitle,
                blogDesc,
                userId: decode.id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Blog Created Successfully",
            blog,
        });
    } catch (error) {
        console.log(error);
        res.status(402).json({
            success: false,
            message: "Cannot Create Blog",
        });
        return;
    }
};

export const getAllBlogs = async (req: AuthRequest, res: Response) => {
    try {
        const decode = req.user;
        if (!decode) {
            res.status(401).json({
                success: false,
                message: "Unauthorize Please SignIn first",
            });
            return;
        }
        const allBlogs = await client.blog.findMany();
        res.status(200).json({
            success: true,
            message: "All the Blogs Fetched",
            allBlogs,
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Error while getting all the blogs",
        });
        return;
    }
};

export const getAllPersonalBlogs = async (req: AuthRequest, res: Response) => {
    try {
        const decode = req.user;
        if (!decode) {
            res.status(401).json({
                success: false,
                message: "Unauthorize Please SignIn first",
            });
            return;
        }
        const allBlogs = await client.blog.findMany({
            where: {
                userId: decode.id,
            },
        });
        if (!allBlogs) {
            res.status(200).json({
                success: true,
                message: "There are no personal blogs yet",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "All the Blogs Fetched",
            allBlogs,
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Error while getting all the blogs",
        });
        return;
    }
};

export const getSpecificBlog = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params
        console.log(id)
        const decode = req.user
        if(!id){
            res.status(404).json({
                success: false,
                message: "No Blog found"
            })
            return;
        }
        if(!decode){
            res.status(401).json({
                success: false,
                message: "Not Authorized. Please Signup first"
            })
            return;
        }
        const blog = await client.blog.findFirst({
            where: {
                id: Number(id)
            }
        })
        if(!blog){
            res.status(402).json({
                success: false,
                message: "No blog found with this id"
            })
            return;
        }
        res.status(200).json({
            success: true,
            message: "Blog Found",
            blog
        })
        
    } catch (error) {
        console.log(error)
        res.status(401).json({
            success: false,
            message: "Cannot Get the blog"
        })
    }
}

export const deleteABlog = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params
        const decode = req.user
        if(!id){
            res.status(404).json({
                success: false,
                message: "No Blog found"
            })
            return;
        }
        if(!decode){
            res.status(401).json({
                success: false,
                message: "Not Authorized. Please Signup first"
            })
            return;
        }
        const blog = await client.blog.delete({
            where: {
                id: Number(id),
                userId: decode.id
            }
        })
        if(!blog){
            res.status(402).json({
                success: false,
                message: "No blog found with this id"
            })
            return;
        }
        res.status(200).json({
            success: false,
            message: "Blog Found",
            blog
        })
        
    } catch (error) {
        console.log(error)
        res.status(401).json({
            success: false,
            message: "Cannot Get the blog"
        })
    }
}
