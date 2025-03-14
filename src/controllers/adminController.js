const {
  getUsersStats,
  getAllUsers,
  getUserDetails,
  createUser,
  getUserByUsername,
} = require("../db/users");
const { getAllLinks } = require("../db/links");
const { getSMTPConfig, updateSMTPConfig } = require("../db/settings");

exports.dashboardPage = async (req, res) => {
  try {
    const csrf = req.csrf();
    const stats = await getUsersStats();
    const { activeLinks, inactiveLinks } = await getAllLinks();
    const { users } = await getAllUsers();

    return res.render("admin-dashboard", {
      csrf,
      user: req.user,
      stats: {
        admins: stats.admins,
        users: stats.users,
        activeLinks,
        inactiveLinks,
      },
      users,
    });
  } catch (error) {
    return res.render("error");
  }
};

exports.settingsPage = async (req, res) => {
  try {
    const csrf = req.csrf();
    const { config } = await getSMTPConfig();

    return res.render("admin-settings", {
      csrf,
      user: req.user,
      config,
    });
  } catch (error) {
    return res.render("error");
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { host, port, user, password, secure = false } = req.body;

    await updateSMTPConfig({
      smtpHost: host,
      smtpPort: port,
      smtpUser: user,
      smtpPass: password,
      smtpSecure: secure === "on",
    });

    return res.status(200).redirect("/admin/settings");
  } catch (error) {
    return res.status(500).render("error");
  }
};

exports.addAdmin = async (req, res) => {
  const { name, username, password, confirmPassword } = req.body;
  if (!name || !username || !password || !confirmPassword) {
    return res.status(400).redirect("/admin");
  }

  if (password !== confirmPassword) {
    return res.status(400).redirect("/admin");
  }

  try {
    const alreadyExists = await getUserByUsername(username);
    if (alreadyExists.success) {
      return res.status(400).redirect("/admin");
    }

    await createUser({
      type: "admin",
      name,
      username,
      password,
    });

    return res.status(200).redirect("/admin");
  } catch (error) {
    console.error(error);
    return res.status(500).render("error");
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { id: accountId } = req.params;
    const response = await getUserDetails(accountId);

    if (response.user) {
      const csrf = req.csrf();

      return res
        .status(200)
        .render("user-details", { csrf, user: response.user });
    }

    return res.status(404).render("not-found");
  } catch (error) {
    return res.status(500).render("error");
  }
};
