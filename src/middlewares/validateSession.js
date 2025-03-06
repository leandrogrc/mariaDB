const { validateSession } = require("../db/session");

module.exports = async function (req, res, next) {
  try {
    const sessionToken = req.cookies.session_token;
    if (!sessionToken) {
      return res.status(401).redirect("/login");
    }

    const validSsession = await validateSession(sessionToken);
    if (!validSsession.success) {
      return res.status(401).redirect("/login");
    }

    req.user = validSsession.result;

    return next();
  } catch (error) {
    console.error("Failed to validate session", error);
    return res.status(500).render("error");
  }
};
