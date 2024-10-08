import { PrismaClient } from "@prisma/client";
import modelextensions from "./extensions/modelextensions";
import clientextensions from "./extensions/clientextensions";
import fieldextensions from "./extensions/fieldextensions";

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

export default extendedclient;
