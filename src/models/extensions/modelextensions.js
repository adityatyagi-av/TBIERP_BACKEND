import 'dotenv/config';
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma, extendedclient } from "../prismaClient.js";


async function hashPassword(password){
    return await bcrypt.hash(password, 10);
}

const modelextensions = {
    model: {
        $allModels: {
            async exists(where){
                const context = Prisma.getExtensionContext(this);
                const result = await context.findFirst({where});
                return result!==null;
            },
        },
        registration: {
            async create(args){
                const schemeName = args.data.scheme;
                const existingScheme = await extendedclient.scheme.findUnique({
                    where: { schemeName },
                });
                let scheme;
                if (existingScheme) {
                    scheme = { connect: { id: existingScheme.id } };
                } else {
                    scheme = await extendedclient.scheme.create({
                      data: { schemeName },
                    });
                    scheme = { connect: { id: scheme.id } };
                }
                args.data.scheme = scheme;
                return await prisma.registration.create(args);
            },
        },
        manager: {
            async create(args){
                const context = Prisma.getExtensionContext(this);
                const hashedPassword = await hashPassword(args.data.password);
                args.data.password = hashedPassword;
                return await context.create(args);
            },
            async update(args){
                const context = Prisma.getExtensionContext(this);
                if(!args.data.password)return await context.update(args);
                const hashedPassword = await hashPassword(args.data.password);
                args.data.password = hashedPassword;
                return await context.update(args);
            },
            async comparePassword(args){
                const context = Prisma.getExtensionContext(this);
                const savedUser = await context.findUnique({where:args.data,});
                return await bcrypt.compare(args.data.password, savedUser.password);
            },
            async SignAccessToken(args) {
                const context = Prisma.getExtensionContext(this);
                const manager = await context.findUnique({where: args.where, select:{id:true, username:true, managertype:true},});
                const token = jwt.sign({ id: manager.id, username: manager.username, managertype:  manager.managertype}, process.env.ACCESS_TOKEN_SECRET || "", {
                  expiresIn: "5m",
                });
                return token;
            },
            async SignRefreshToken(args) {
                const context = Prisma.getExtensionContext(this);
                const manager = await context.findUnique({where: args.where, select:{id:true, username:true, managertype:true},});
                const token = jwt.sign({ id: manager.id, username: manager.username, managertype:  manager.managertype}, process.env.ACCESS_TOKEN_SECRET || "", {
                  expiresIn: "3d",
                });
                args.data.refreshToken = token;
                await context.update(args);
                return token;
            },
        },
        founder: {
            async create(args){
                const context = Prisma.getExtensionContext(this);
                const hashedPassword = await hashPassword(args.data.password);
                args.data.password = hashedPassword;
                return await context.create(args);
            },
            async update(args){
                const context = Prisma.getExtensionContext(this);
                if(!args.data.password)return await context.update(args);
                const hashedPassword = await hashPassword(args.data.password);
                args.data.password = hashedPassword;
                return await context.update(args);
            },
            async comparePassword(args){
                const context = Prisma.getExtensionContext(this);
                const savedUser = await context.findUnique({where:args.data,});
                return await bcrypt.compare(args.data.password, savedUser.password);
            },
            async SignAccessToken(args) {
                const context = Prisma.getExtensionContext(this);
                const founder = await context.findUnique({where:args.where,select:{id:true, username:true},})
                const token = jwt.sign({ id: founder.id, username: founder.username}, process.env.ACCESS_TOKEN_SECRET || "", {
                  expiresIn: "5m",
                });
                return token;
            },
            async SignRefreshToken(args) {
                const context = Prisma.getExtensionContext(this);
                const founder = await context.findUnique({where:args.where,select:{id:true, username:true},})
                const token = jwt.sign({ id: founder.id, username: founder.username}, process.env.ACCESS_TOKEN_SECRET || "", {
                  expiresIn: "3d",
                });
                args.data.refreshToken = token;
                await context.update(args);
                return token;
            },
        },
        admin: {
            async create(args){
                const context = Prisma.getExtensionContext(this);
                const hashedPassword = await hashPassword(args.data.password);
                args.data.password = hashedPassword;
                return await context.create(args);
            },
            async update(args){
                const context = Prisma.getExtensionContext(this);
                if(!args.data.password)return await context.update(args);
                const hashedPassword = await hashPassword(args.data.password);
                args.data.password = hashedPassword;
                return await context.update(args);
            },
            async comparePassword(args){
                const context = Prisma.getExtensionContext(this);
                const savedUser = await context.findUnique({where:args.data,});
                return await bcrypt.compare(args.data.password, savedUser.password);
            },
            async SignAccessToken(args) {
                const context = Prisma.getExtensionContext(this);
                const admin = await context.findUnique({where:args.where,select:{id:true, username:true},})
                const token = jwt.sign({ id: admin.id, username: admin.username}, process.env.ACCESS_TOKEN_SECRET || "", {
                  expiresIn: "5m",
                });
                return token;
            },
            async SignRefreshToken(args) {
                const context = Prisma.getExtensionContext(this);
                const admin = await context.findUnique({where:args.where,select:{id:true, username:true},})
                const token = jwt.sign({ id: admin.id, username: admin.username}, process.env.ACCESS_TOKEN_SECRET || "", {
                  expiresIn: "3d",
                });
                args.data.refreshToken = token;
                await context.update(args);
                return token;
            },
        },
    }
};

export default modelextensions;