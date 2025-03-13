const {
  getUserByUsername,
  createUser,
  getUsersStats,
  getAllUsers,
} = require("../db/users");
const { createSession } = require("../db/session");
const { hasAdmin } = require("../db/users");
const { getAllLinks } = require("../db/links");
const bcrypt = require("bcrypt");

const hashSalt = 10;

exports.adminPage = async (req, res) => {
  const csrf = req.csrf();
  try {
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
    });
  } catch (error) {
    return res.render("error");
  }
};

exports.adminLoginPage = async (req, res) => {
  try {
    const csrf = req.csrf();
    const { result } = await hasAdmin();

    if (result) {
      return res.status(200).redirect("/login");
    }

    return res.status(200).render("register-admin", {
      csrf,
      name: "",
      username: "",
      error: "",
    });
  } catch (error) {
    return res.status(500).render("error");
  }
};

exports.registerAdmin = async (req, res) => {
  const csrf = req.csrf();
  const { name, username, password, confirmPassword } = req.body;
  if (!name || !username || !password || !confirmPassword) {
    return res.status(400).render("register-admin", {
      csrf,
      name: "",
      username: "",
      error: "Alguns dados estão faltando",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).render("register-admin", {
      csrf,
      name,
      username,
      error: "Senha e confirmação devem ser o mesmo",
    });
  }

  try {
    const alreadyExists = await getUserByUsername(username);
    if (alreadyExists.success) {
      return res.render("register-admin", {
        csrf,
        name,
        username,
        error: "Usuário já cadastrado",
      });
    }

    const cryptPassword = await bcrypt.hash(password, hashSalt);
    const newuser = await createUser({
      type: "admin",
      name,
      username,
      password: cryptPassword,
    });

    if (newuser.success) {
      const { result: sessionId } = await createSession(newuser.response.id);

      res.cookie("session_token", sessionId, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60,
      });

      return res.status(200).redirect("/admin");
    } else {
      return res.status(500).render("register-admin", {
        csrf,
        name,
        username,
        error: "Não foi possível criar usuário",
      });
    }
  } catch (error) {
    console.error("Error during user creation:", error);
    return res.status(500).render("error");
  }
};
