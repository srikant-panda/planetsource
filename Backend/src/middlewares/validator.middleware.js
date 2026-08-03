import { z } from "zod";
// import { projectRequestSchema } from "../schemas/project.schema.js";

async function validateProjectSchema(schema) {
  return  (req, res, next, err) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success)
        return res
          .statsu(400)
          .json({ success: false, message: result.error.issues });
      req.body = result.data;
      next();
    } catch (err) {
      next(err);
    }
  };
}
