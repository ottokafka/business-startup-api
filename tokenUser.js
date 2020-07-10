const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const tokenUser = req.header("tokenUser");

  //check if not tokenUser
  if (!tokenUser) {
    return res.status(401).json({ msg: "no tokenUser, authorization denied" });
  }

  try {
    const decoded = jwt.verify(tokenUser, "gateway");
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "tokenUser not valid" });
  }
};
