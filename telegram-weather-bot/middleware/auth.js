import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

function checkAdminAuthentication(req, res, next) {
  const authHeader = req.headers["authorization"];
  const adminToken = authHeader && authHeader.split(" ")[1]; // 'Bearer <token>'

  if (!adminToken) {
    return res.status(403).json({ error: "Access denied: Token is missing" });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(adminToken, process.env.JWT_SECRET);

    req.user = decodedToken; // Attach decoded token to the request
    next();
  } catch (error) {
    console.error("Token verification error:", error);

    // Handle token expiration
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired, please log in again" });
    }

    return res.status(403).json({ error: "Access denied: Invalid token" });
  }
}

export default checkAdminAuthentication;
