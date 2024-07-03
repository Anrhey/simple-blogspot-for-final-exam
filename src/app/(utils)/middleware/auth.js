import { verifyToken } from "../auth/auth";

export const authMiddleware = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = verifyToken(token);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user; // Attach user info to request
    return handler(req, res);
  };
};
