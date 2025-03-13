module.exports = async function (req, res, next) {
  try {
    if (!req.user || req.user?.type !== "admin") {
      return res.status(401).redirect("/admin/login");
    }

    return next();
  } catch (error) {
    console.error("Failed to validate session", error);
    return res.status(500).render("error");
  }
};
