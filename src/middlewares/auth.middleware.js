import { extendedclient as prisma } from "../models/prismaClient.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshToken as managergen } from "../controllers/manager.controller.js";
import { generateAccessAndRefreshToken as admingen } from "../controllers/admin.controller.js";
import { generateAccessAndRefreshToken as foundergen } from "../controllers/founder.controller.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    const refreshtoken =
      req.cookies?.refreshtoken ||
      req.header("Authorization")?.replace("Refresh", "");

    if (!token) {
      const decodedRefreshToken = jwt.verify(
        refreshtoken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      if (!decodedRefreshToken)
        throw new ApiError(402, "Invalid Refresh Token");
      const baseUrl = req.baseUrl.toString();
      if (baseUrl.includes("admin")) {
        const id = decodedRefreshToken.id;
        const admin = await prisma.admin.findUnique({
          where: { id },
          select: { id: true, username: true },
        });
        if (!admin) {
          throw new ApiError(402, "Invalid refresh token");
        }
        const { newaccess, newrefresh } = admingen();
        req.cookies?.accessToken = newaccess;
        req.cookies?.refreshToken = newrefresh;
        req.user = admin;
      } else if (baseUrl.includes("manager")) {
        const id = decodedToken.id;
        const manager = await prisma.manager.findUnique({
          where: { id },
          select: { id: true, username: true, managertype: true },
        });
        if (!manager) {
          throw new ApiError(401, "Invalid refresh token");
        }
        const { newaccess, newrefresh } = managergen();
        req.cookies?.accessToken = newaccess;
        req.cookies?.refreshToken = newrefresh;
        req.user = manager;
      } else if (baseUrl.includes("founder")) {
        const id = decodedToken.id;
        const founder = await prisma.founder.findUnique({
          where: { id },
          select: { id: true, username: true },
        });
        if (!founder) {
          throw new ApiError(401, "Invalid refresh token");
        }
        const { newaccess, newrefresh } = foundergen();
        req.cookies?.accessToken = newaccess;
        req.cookies?.refreshToken = newrefresh;
        req.user = founder;
      }
      const options = {
        httpOnly: true,
        secure: true,
      };
      res
        .cookie("accessToken", newaccess, options)
        .cookie("refreshToken", newrefresh, options);
      next();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      throw new ApiError(402, "Invalid Access Token");
    }

    const baseUrl = req.baseUrl.toString();

    if (baseUrl.includes("admin")) {
      const id = decodedToken.id;
      const admin = await prisma.admin.findUnique({
        where: { id },
        select: { id: true, username: true },
      });
      if (!admin) {
        throw new ApiError(402, "Invalid access token");
      }
      req.user = admin;
    } else if (baseUrl.includes("manager")) {
      const id = decodedToken.id;
      const manager = await prisma.manager.findUnique({
        where: { id },
        select: { id: true, username: true, managertype: true },
      });
      if (!manager) {
        throw new ApiError(402, "Invalid access token");
      }
      req.user = manager;
    } else if (baseUrl.includes("founder")) {
      const id = decodedToken.id;
      const founder = await prisma.founder.findUnique({
        where: { id },
        select: { id: true, username: true },
      });
      if (!founder) {
        throw new ApiError(402, "Invalid access token");
      }
      req.user = founder;
    }

    next();
  } catch (error) {
    throw new ApiError(402, error?.message || "Invalid access token");
  }
});

export { verifyJWT };
