const jwt = require("jsonwebtoken");

module.exports.generateToken = (user) => {
  let tokenUser=jwt.sign(
    { email: user.email, name: user.name, password: user.password },
    process.env.TOKEN_KEY,
    { expiresIn: process.env.TOKEN_EXPIRATION }
  );
  return tokenUser;
};
