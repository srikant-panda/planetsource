import bcrypt from "bcrypt";
// import  JsonWebTokenError, TokenExpiredError from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";


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


async function createToken(payload, exp) {
    try {
        const token = jwt.sign(
            { id: payload },
            config.JWT_SECRET,
            { expiresIn: exp }
        )
        return token;
    } catch (err) {
        console.error(err.name);
        throw err;
    }
}

async function decodeToken(token) {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
        console.error(err.name);
        throw err;
    }
}


export const authUtils = {
    hashData,
    compareHash,
    createToken,
    decodeToken
}