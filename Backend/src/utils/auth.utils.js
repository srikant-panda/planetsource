import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
import Session from "../models/auth.model.js"
import crypto from "node:crypto"

async function hashData(payload) {
    try {
        const hashedPayload = await bcrypt.hash(payload, 10);
        return hashedPayload;
    } catch (err) {
        console.error(err.name);
        throw err;

    }
}


async function compareHash(hashedData, payload) {
    try {
        const isEqual = await bcrypt.compare(payload, hashedData);
        return isEqual;
    } catch (err) {
        console.error(err.name);
        throw err;
    }
}


async function createToken(id, exp) {
    try {
        const JTI = crypto.randomUUID();
        const token = jwt.sign(
            { id,JTI },
            config.JWT_SECRET,
            { expiresIn: exp }
        )
        return { token,JTI }
    } catch (err) {
        console.error(err.name);
        throw err;
    }
}

async function decodeToken(token) {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
        // console.error(err.name);
        throw err;
    }
}
async function storeSession(userId,JTI) {
    const isSesnStred = await Session.create({
        userId: userId,
        JTI
    });
    return isSesnStred
}

export const authUtils = {
    hashData,
    compareHash,
    createToken,
    decodeToken,
    storeSession
}