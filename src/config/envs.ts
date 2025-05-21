import "dotenv/config";
import * as joi from "joi";

interface Envs {
    PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required().default(3000),
}).unknown(true);

const { error, value } = envsSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
});

if (error) {
    console.error("Environment variables validation error:", error.details);
    process.exit(1);
}

const envsValidates: Envs = value as Envs;

export const envs = {
    PORT: envsValidates.PORT,
}