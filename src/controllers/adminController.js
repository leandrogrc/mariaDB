const {
  getUsersStats,
  getAllUsers,
  getUserDetails,
  createUser,
  getUserByUsername,
} = require("../db/users");
const { getAllLinks } = require("../db/links");

exports.adminPage = async (req, res) => {
  try {
    const { tab = "dashboard" } = req.query;

    const csrf = req.csrf();
    const stats = await getUsersStats();
    const { activeLinks, inactiveLinks } = await getAllLinks();
    const { users } = await getAllUsers();

    return res.render("admin", {
      csrf,
      user: req.user,
      stats: {
        admins: stats.admins,
        users: stats.users,
        activeLinks,
        inactiveLinks,
      },
      users,
      tab,
    });
  } catch (error) {
    return res.render("error");
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
