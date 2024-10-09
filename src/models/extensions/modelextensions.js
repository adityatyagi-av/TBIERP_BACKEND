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
                try {
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
                } catch (error) {
                    console.log("Error:", error);
                }
            },
        },
        manager: {
            async create(args){
                try {
                    const hashedPassword = await hashPassword(args.data.password);
                    args.data.password = hashedPassword;
                    return await prisma.manager.create(args);
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async update(args){
                try {
                    if(!args.data.password)return await prisma.update(args);
                    const hashedPassword = await hashPassword(args.data.password);
                    args.data.password = hashedPassword;
                    return await prisma.manager.update(args);
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async comparePassword(args){
                try {
                    const context = Prisma.getExtensionContext(this);
                    const savedUser = await context.findUnique({where:{username: args.data.username},});
                    return await bcrypt.compare(args.data.password, savedUser.password);
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async SignAccessToken(args) {
                try {
                    const context = Prisma.getExtensionContext(this);
                    const manager = await context.findUnique({where: args.where, select:{id:true, username:true, managertype:true},});
                    const token = jwt.sign({ id: manager.id, username: manager.username, managertype:  manager.managertype}, process.env.ACCESS_TOKEN_SECRET || "", {
                      expiresIn: "5m",
                    });
                    return token;
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async SignRefreshToken(args) {
                try {
                    const context = Prisma.getExtensionContext(this);
                    const manager = await context.findUnique({where: args.where, select:{id:true, username:true, managertype:true},});
                    const token = jwt.sign({ id: manager.id, username: manager.username, managertype:  manager.managertype}, process.env.REFRESH_TOKEN_SECRET || "", {
                      expiresIn: "3d",
                    });
                    args.data.refreshToken = token;
                    await context.update(args);
                    return token;
                } catch (error) {
                    console.log("Error:", error);
                }
            },
        },
        founder: {
            async create(args){
                try {
                    const hashedPassword = await hashPassword(args.data.password);
                    args.data.password = hashedPassword;
                    return await prisma.founder.create(args);
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async update(args){
                try {
                    if(!args.data.password)return await prisma.update(args);
                    const hashedPassword = await hashPassword(args.data.password);
                    args.data.password = hashedPassword;
                    return await prisma.founder.update(args);
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async comparePassword(args){
                try {
                    const context = Prisma.getExtensionContext(this);
                    const savedUser = await context.findUnique({where:{username: args.data.username},});
                    return await bcrypt.compare(args.data.password, savedUser.password);
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async SignAccessToken(args) {
                try {
                    const context = Prisma.getExtensionContext(this);
                    const founder = await context.findUnique({where:args.where,select:{id:true, username:true},})
                    const token = jwt.sign({ id: founder.id, username: founder.username}, process.env.ACCESS_TOKEN_SECRET || "", {
                      expiresIn: "5m",
                    });
                    return token;
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async SignRefreshToken(args) {
                try {
                    const context = Prisma.getExtensionContext(this);
                    const founder = await context.findUnique({where:args.where,select:{id:true, username:true},})
                    const token = jwt.sign({ id: founder.id, username: founder.username}, process.env.REFRESH_TOKEN_SECRET || "", {
                      expiresIn: "3d",
                    });
                    args.data.refreshToken = token;
                    await context.update(args);
                    return token;
                } catch (error) {
                    console.log("Error:", error);
                }
            },
        },
        admin: {
            async create(args){
                try {
                    const hashedPassword = await hashPassword(args.data.password);
                    args.data.password = hashedPassword;
                    return await prisma.admin.create(args);
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async update(args){
                try {
                    if(!args.data.password)return await prisma.admin.update(args);
                    const hashedPassword = await hashPassword(args.data.password);
                    args.data.password = hashedPassword;
                    return await prisma.admin.update(args);
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async comparePassword(args){
                try {
                    const context = Prisma.getExtensionContext(this);
                    const savedUser = await context.findUnique({where:{username: args.data.username},});
                    return await bcrypt.compare(args.data.password, savedUser.password);
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async SignAccessToken(args) {
                try {
                    const context = Prisma.getExtensionContext(this);
                    const admin = await context.findUnique({where:args.where,select:{id:true, username:true},})
                    const token = jwt.sign({ id: admin.id, username: admin.username}, process.env.ACCESS_TOKEN_SECRET || "", {
                      expiresIn: "5m",
                    });
                    return token;
                } catch (error) {
                    console.log("Error:", error);
                }
            },
            async SignRefreshToken(args) {
                try {
                    const context = Prisma.getExtensionContext(this);
                    const admin = await context.findUnique({where:args.where,select:{id:true, username:true},});
                    const token = jwt.sign({ id: admin.id, username: admin.username}, process.env.REFRESH_TOKEN_SECRET || "", {
                      expiresIn: "3d",
                    });
                    args.data.refreshToken = token;
                    await context.update(args);
                    return token;
                } catch (error) {
                    console.log("Error:", error);
                }
            },
        },
    }
};

export default modelextensions;