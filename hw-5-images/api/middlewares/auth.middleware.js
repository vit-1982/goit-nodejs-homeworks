const jwt = require("jsonwebtoken");
const userModel = require("../users/user.model");
const { UnauthorizedError } = require("../helpers/errors.constructors");

module.exports.authorizeUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    if (!authorizationHeader) {
      throw new UnauthorizedError("authorization header not found!");
    }
    const token = authorizationHeader.replace("Bearer ", "");

    let userId;
    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (err) {
      next(new UnauthorizedError("User not authorized"));
    }

    const user = await userModel.findById(userId);
    if (!user || user.token !== token) {
      throw new UnauthorizedError("User not authorized!");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};

// module.exports.authorizeUser = async (req, res, next) => {
//   const authHeader = req.headers["authorization"];

//   if (!authHeader) {
//     res.status(401).json({ message: "authorization header not found!" });
//   }

//   const [tokenType, jwtToken] = authHeader.split(" ");

//   if (!jwtToken) {
//     res.status(401).json({ message: "JWT not found!" });
//   }

//   req.user = jwt.verify(jwtToken, process.env.JWT_SECRET);
//   req.token = jwtToken;
//   next();
// };
