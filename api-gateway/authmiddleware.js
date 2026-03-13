import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");

    // attach user info
    req.user = decoded;

    // pass userId to services
    req.headers["x-user-id"] = decoded.userId;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};