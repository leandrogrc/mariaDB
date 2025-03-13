const { getUserByUsername, createUser } = require("../db/users");
const { createSession, removeSession } = require("../db/session");
const bcrypt = require("bcrypt");

const hashSalt = 10;

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).render("login", {
      username,
      error: "Usuário e senha são obrigatórios",
    });
  }

  try {
    const result = await getUserByUsername(username, true);
    if (result.success) {
      const samePassword = await bcrypt.compare(
        password,
        result.response.password
      );

      if (samePassword) {
        const { result: sessionId } = await createSession(result.response.id);

        res.cookie("session_token", sessionId, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 1000 * 60 * 60,
        });

        if (result.response.type === "admin") {
          return res.status(200).redirect("/admin");
        }

        return res.status(200).redirect("/account");
      }
    }

    return res.status(400).render("login", {
      username,
      error: "Usuário ou senha inválidos",
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).render("error");
  }
};

exports.loginPage = async (req, res) => {
  const csrf = req.csrf();
  return res.render("login", {
    action: "/login",
    csrf,
    username: "",
    error: "",
  });
};

exports.register = async (req, res) => {
  const csrf = req.csrf();
  const { name, username, password, confirmPassword } = req.body;
  if (!name || !username || !password || !confirmPassword) {
    return res.status(400).render("register", {
      csrf,
      name: "",
      username: "",
      error: "Alguns dados estão faltando",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).render("register", {
      csrf,
      name,
      username,
      error: "Senha e confirmação devem ser o mesmo",
    });
  }

  try {
    const alreadyExists = await getUserByUsername(username);
    if (alreadyExists.success) {
      return res.render("register", {
        csrf,
        name,
        username,
        error: "Usuário já cadastrado",
      });
    }

    const cryptPassword = await bcrypt.hash(password, hashSalt);
    const newuser = await createUser({
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

      return res.status(200).redirect("/account");
    } else {
      return res.status(500).render("register", {
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

exports.registerPage = async (req, res) => {
  const csrf = req.csrf();
  return res.render("register", {
    csrf,
    name: "",
    username: "",
    error: "",
  });
};

exports.logout = async (req, res) => {
  try {
    await removeSession(req.cookies.session_token);
  } catch (error) {
    console.error(error);
  }

  res.clearCookie("session_token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return res.status(200).redirect("/login");
};
