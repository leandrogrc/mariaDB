const { getUserByUsername, createUser } = require("../db/users");
const { createSession } = require("../db/session");
const bcrypt = require("bcrypt");

const hashSalt = 10;

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const result = await getUserByUsername(username);
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

        return res.status(200).json({
          message: "Logged in successfully",
        });
      }
    }

    return res.status(400).json({
      error: "Username or password invalid",
    });
  } catch (error) {
    console.error("Error in postLink:", err);
    return res.status(500).json({ error: "Failed login" });
  }
};

exports.register = async (req, res) => {
  const {
    name,
    username,
    password,
    photoUrl = null,
    description = null,
  } = req.body;
  if (!name || !username || !password)
    return res
      .status(400)
      .json({ error: "Username and Password are required" });
  try {
    const cryptPassword = await bcrypt.hash(password, hashSalt);
    const result = await createUser({
      name,
      username,
      password: cryptPassword,
      photoUrl,
      description,
    });

    if (result.success) {
      return res.status(200).json({
        message: "User added successfully",
        insertId: result.insertId,
      });
    } else {
      return res.status(500).json({
        error: "Failed to add user",
        details: result.message || result.error,
      });
    }
  } catch (err) {
    console.error("Error in post user func:", err);
    return res.status(500).json({ error: "Failed to add user" });
  }
};
