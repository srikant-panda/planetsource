// import { trim } from "validator";
import { authUtils } from "../utils/auth.utils.js";
import Session from "../models/auth.model.js";

function getCurrentUser(type = "access") {
  return async (req, res, next) => {
    try {
      const token =
        type.toLowerCase().trim() === "access"
          ? req.headers.authorization?.split(" ")[1]
          : req.cookies?.refreshToken;
      if (!token)
        return res.status(401).json({ message: `${type} token required.` });
      if (type.toLowerCase().trim() === "access") {
        if (!req.headers.authorization?.startsWith("Bearer "))
          return res
            .status(400)
            .json({ message: "Invalid authorization header." });
      }
      const tokenData = await authUtils.decodeToken(token);
      if (type.toLowerCase().trim() === "refresh") {
        const isRevoked = await Session.findOne({ JTI: tokenData.JTI }) || {};
        if (isRevoked.revoked)
          return res
            .status(404)
            .json({ message: "Token not valid", success: false });
      }
      req.tokenData = tokenData;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          code: "TOKEN_EXPIRED",
          message: "Access token has expired",
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          code: "INVALID_TOKEN",
          message: "Invalid access token",
        });
      }

      if (err.name === "NotBeforeError") {
        return res.status(401).json({
          success: false,
          code: "TOKEN_NOT_ACTIVE",
          message: "Token is not active yet",
        });
      }

      next(err);
    }
  };
}
// async function getRefreshTokenData(req, res, next) {
// try {
//   // if(!req.headers.authorization?.startsWith("Bearer ")) return res.status(400).json({message:"Invalid authorization header."})
//   const token = req.cookies?.refresh_token;
//   // console.log(token);
//   if (!token)
//     return res.status(401).json({ message: "Refresh token required." });
//   const decodeTokenData = await authUtils.decodeToken(token);
//   // console.log(decodeTokenData);
//   req.user = decodeTokenData;
//   next();
// } catch (err) {
//   if (err.name === "TokenExpiredError") {
//     return res.status(401).json({
//       success: false,
//       code: "TOKEN_EXPIRED",
//       message: "Refresh token has expired",
//     });
//   }

//   if (err.name === "JsonWebTokenError") {
//     return res.status(401).json({
//       success: false,
//       code: "INVALID_TOKEN",
//       message: "Invalid refresh token",
//     });
//   }

//   if (err.name === "NotBeforeError") {
//     // console.error(err)
//     return res.status(401).json({
//       success: false,
//       code: "TOKEN_NOT_ACTIVE",
//       message: "Token is not active yet",
//     });
//   }

//   next(err);
// }
// }

export { getCurrentUser };
