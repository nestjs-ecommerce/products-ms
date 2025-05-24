import "dotenv/config";
import * as joi from "joi";

interface Envs {
    PORT: number;
    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    PORT: joi.number().required().default(3000),
    NATS_SERVERS: joi.array().items(joi.string()).required().default([]),
}).unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS ? process.env.NATS_SERVERS.split(",") : [],
});

if (error) {
    console.error("Environment variables validation error:", error.details);
    process.exit(1);
}

const envsValidates: Envs = value as Envs;

export const envs = {
    PORT: envsValidates.PORT,
    NATS_SERVERS: envsValidates.NATS_SERVERS,
}