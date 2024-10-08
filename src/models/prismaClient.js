import { PrismaClient } from "@prisma/client";
import modelextensions from "./extensions/modelextensions.js";
import clientextensions from "./extensions/clientextensions.js";
import fieldextensions from "./extensions/fieldextensions.js";

const prisma = new PrismaClient();


const extendedclient = prisma.$extends({
    client: {
        ...clientextensions.client,
    },
    model: {
        ...modelextensions.model,
    },
    field: {
        ...fieldextensions.field,
    },
});

export  {prisma, extendedclient};
