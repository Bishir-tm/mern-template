const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("called user");
  const token = req.header("Authorization");
  if (!token) {
    console.log("no user token found");
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "68149540");
    req.user = decoded;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Token has expired"
        : "Token is not valid";
    res.status(401).json({ message });
  }
};

module.exports = authMiddleware;
