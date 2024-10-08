import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import extendedclient from "../prismaClient.js";

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
                const schemename = args.data.scheme;
                const scheme = await extendedclient.scheme.create({schemeName: schemename});
                args.data.scheme=scheme;
                return await this.create(args);
            },
        },
        manager: {
            async create(args){
                const hashedPassword = await bcrypt.hash(args.data.password, 10);
                args.data.password = hashedPassword;
                return await this.create(args);
            },
            async update(args){
                if(!args.data.password)return await this.update(args);
                const hashedPassword = await bcrypt.hash(args.data.password, 10);
                args.data.password = hashedPassword;
                return await this.update(args);
            },
            async comparePassword(args){
                const savedUser = await this.findUnique(args.data);
                return await bcrypt.compare(args.data.password, savedUser.password);
            },
            async SignAccessToken(args) {
                const token = jwt.sign({ id: args.data.id, username: args.data.username, managertype:  args.data.managertype}, process.env.ACCESS_TOKEN_SECRET || "", {
                  expiresIn: "5m",
                });
                args.data.accessToken = token;
                await this.update(args);
                return token;
            },
            async SignRefreshToken(args) {
                const token = jwt.sign({ id: args.data.id, username: args.data.username, managertype:  args.data.managertype}, process.env.REFRESH_TOKEN_SECRET || "", {
                    expiresIn: "3d",
                });
                args.data.refreshToken = token;
                await this.update(args);
                return token;
            },
        },
        founder: {
            async create(args){
                const hashedPassword = await bcrypt.hash(args.data.password, 10);
                args.data.password = hashedPassword;
                return await this.create(args);
            },
            async update(args){
                if(!args.data.password)return await this.update(args);
                const hashedPassword = await bcrypt.hash(args.data.password, 10);
                args.data.password = hashedPassword;
                return await this.update(args);
            },
            async comparePassword(args){
                const savedUser = await this.findUnique(args.data);
                return await bcrypt.compare(args.data.password, savedUser.password);
            },
            async SignAccessToken(args) {
                const token = jwt.sign({ id: args.data.id, username: args.data.username}, process.env.ACCESS_TOKEN_SECRET || "", {
                  expiresIn: "5m",
                });
                args.data.accessToken = token;
                await this.update(args);
                return token;
            },
            async SignRefreshToken(args) {
                const token = jwt.sign({ id: args.data.id, username: args.data.username}, process.env.REFRESH_TOKEN_SECRET || "", {
                    expiresIn: "3d",
                });
                args.data.refreshToken = token;
                await this.update(args);
                return token;
            },
        },
        admin: {
            async create(args){
                const hashedPassword = await bcrypt.hash(args.data.password, 10);
                args.data.password = hashedPassword;
                return await this.create(args);
            },
            async update(args){
                if(!args.data.password)return await this.update(args);
                const hashedPassword = await bcrypt.hash(args.data.password, 10);
                args.data.password = hashedPassword;
                return await this.update(args);
            },
            async comparePassword(args){
                const savedUser = await this.findUnique(args.data);
                return await bcrypt.compare(args.data.password, savedUser.password);
            },
            async SignAccessToken(args) {
                const token = jwt.sign({ id: args.data.id, username: args.data.username, managertype:  args.data.managertype}, process.env.ACCESS_TOKEN_SECRET || "", {
                  expiresIn: "5m",
                });
                args.data.accessToken = token;
                await this.update(args);
                return token;
            },
            async SignRefreshToken(args) {
                const token = jwt.sign({ id: args.data.id, username: args.data.username}, process.env.REFRESH_TOKEN_SECRET || "", {
                    expiresIn: "3d",
                });
                args.data.refreshToken = token;
                await this.update(args);
                return token;
            },
        },
    }
};

export default modelextensions;