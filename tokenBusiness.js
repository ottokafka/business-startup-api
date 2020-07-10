const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const tokenBusiness = req.header("tokenBusiness");

  //check if not tokenBusiness
  if (!tokenBusiness) {
    return res
      .status(401)
      .json({ msg: "no tokenBusiness, authorization denied" });
  }

  try {
    const decoded = jwt.verify(tokenBusiness, "gateway");
    req.business = decoded.business;
    next();
  } catch (err) {
    res.status(401).json({ msg: "tokenBusiness not valid" });
  }
};
