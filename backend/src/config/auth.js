module.exports = {
  jwtSecret: process.env.JWT_SECRET || "mysecretkey",
  jwtExpiration: "1d",
};
