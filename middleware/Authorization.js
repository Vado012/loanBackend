import jwt from "jsonwebtoken";

const authorize = (allowedRoles) => (req, res, next) => {
  console.log("cookies in Request:", req.cookies.token);
  const token = req.cookies?.token

  if (!token)
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    // console.log("Decoded Token:", decoded);

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next(); // Move to the next middleware or controller
  } catch (err) {
    console.log("Token verification error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(400).json({ message: "Invalid token" });
  }
};

export default authorize;