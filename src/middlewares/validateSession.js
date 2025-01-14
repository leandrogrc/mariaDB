const { validateSession } = require("../db/session");

module.exports = async function (req, res, next) {
  try {
    const sessionToken = req.cookies.session_token;
    if (!sessionToken) {
      return res
        .status(401)
        .json({ error: "Missing or invalid session token" });
    }

    const validSsession = await validateSession(sessionToken);
    if (!validSsession.success) {
      return res.status(401).json({ error: validSsession.error });
    }

    req.user = validSsession.result;

    return next();
  } catch (error) {
    return res.status(500).json({
      error: "Failed to validate session",
    });
  }
};
