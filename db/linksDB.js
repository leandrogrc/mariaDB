const {pool} = require('../controllers/connectToDB')

async function getAllLinks() {
  let connection;

  try {
    connection = await pool.getConnection();
    
    const result = await connection.query('SELECT * FROM links');
    if(result.length == 0) return { success: true, response: "Zero links on database!" };
    else return { success: true, response: result };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  } finally {
    if (connection) {
      connection.end();  // Make sure to end the connection after use
      console.log("Disconnected!");
    }
  }
}

async function getLink(linkId) {
  let connection;

  try {
    connection = await pool.getConnection();
    
    const link = await connection.query('SELECT * FROM links WHERE id = ?', [linkId]);
    console.log(link)
    if (link.length === 0) return { success: true, data: null, message: 'not exist'}
    else return { success: true, data: link, message: 'Link found' };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  } finally {
    if (connection) {
      connection.end();  // Make sure to end the connection after use
      console.log("Disconnected!");
    }
  }
}

async function addLinkToUser(userId, link, title) {
  let connection;

  try {
    // Get a connection from the pool
    connection = await pool.getConnection();
    console.log('Connected!');
    // Insert the new link into the `links` table, associating it with the user
    const result = await connection.query('INSERT INTO links (user_id, link, title) VALUES (?, ?, ?)', [userId, link, title]);

    // Log the result and return a structured response
    console.log(`Link added with ID: ${result.insertId}`);
    console.log(result)
    // Handle BigInt by converting it to Number or String
    const insertId = result.insertId.toString();  // You can also use `.toString()` if you need to pass it as a string
    
    return { success: true, insertId };  // Return success object with insertId as string
  } catch (err) {
    console.error('Error adding link to user:', err);
    return { success: false, error: err.message };  // Return error object
  } finally {
    if (connection) {
      connection.end();
      console.log("Disconnected!");
    } // Ensure connection is closed
  }
}

async function delLink(linkId){
  let connection;

  try {
    connection = await pool.getConnection();
    
    const result = await connection.query('DELETE FROM links WHERE id = ?', [linkId]);
    console.log(result)
    const insertId = result.insertId.toString();
    if (result.affectedRows === 0) return { success: true, data: null, message: 'not exist'}
    else return { success: true, data: insertId, message: 'Link found and deleted' };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  } finally {
    if (connection) {
      connection.end();  // Make sure to end the connection after use
      console.log("Disconnected!");
    }
  }
}


module.exports = {addLinkToUser, getAllLinks, getLink, delLink};