import Instance from "../models/instance.model";

export const postInstanceController = async (req, res) => {
  try {
    

  } catch (err) {
    console.log(err.code, err.name);
    res.status(500).json({ message: "Internal server error.", success: false });
  }
};
