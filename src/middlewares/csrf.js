const { createHmac } = require("node:crypto");

module.exports = {
  middleware(req, res, next) {
    req.csrf = function () {
      const token = createHmac("sha256", process.env.COOKIE_SECRET)
        .update(Date.now().toString())
        .digest("hex");

      res.cookie("csrf_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60,
      });

      return token;
    };

    next();
  },
  validate(req, res, next) {
    if (
      !req.body.csrf ||
      !req.cookies.csrf_token ||
      req.cookies.csrf_token !== req.body.csrf
    ) {
      return res.render("error");
    }

    next();
  },
};
