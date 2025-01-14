const { pool } = require("../controllers/connectToDB");

async function getAllUsers() {
  let connection;

  try {
    connection = await pool.getConnection();

    const users = await connection.query("SELECT * FROM users");
    console.log(users);
    return { success: true, users };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (connection) {
      connection.end(); // Make sure to end the connection after use
      console.log("Disconnected!");
    }
  }
}

async function getSingleUsers(username) {
  let connection;

  try {
    connection = await pool.getConnection();

    const user = await connection.query(
      `
      SELECT users.username, users.id, links.link
      FROM users
      INNER JOIN links ON users.id = links.user_id
      WHERE users.username = ?
    `,
      [username]
    );

    const userData = {
      username: user[0].username, // user[0] as there should only be one user
      id: user[0].id,
      links: user.map((row) => row.link), // map to get an array of links
    };

    console.log(userData);

    return { success: true, response: userData };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (connection) {
      connection.end(); // Make sure to end the connection after use
      console.log("Disconnected!");
    }
  }
}

async function postNewUser(username, password) {
  let connection;

  try {
    connection = await pool.getConnection();

    const userFound = await connection.query(
      "SELECT * FROM users where username = ?",
      [username]
    );
    if (userFound.length > 0) console.log(userFound);
    if (userFound.length > 0)
      return {
        success: false,
        error: "User already exists! Try another username",
      };
    else {
      const result = await connection.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password]
      );
      //console.log(result);
      //const insertId = result[0].insertId.toString();
      return { success: true, result };
    }
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (connection) {
      connection.end(); // Make sure to end the connection after use
      console.log("Disconnected!");
    }
  }
}

async function deleteUser(username) {
  let connection;

  try {
    connection = await pool.getConnection();

    const users = await connection.query(
      "DELETE FROM users WHERE username = ?",
      [username]
    );
    console.log("User deleted!", users);
    return { success: true, users };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  } finally {
    if (connection) {
      connection.end(); // Make sure to end the connection after use
      console.log("Disconnected!");
    }
  }
}

module.exports = { getAllUsers, getSingleUsers, postNewUser, deleteUser };
