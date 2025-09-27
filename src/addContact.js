require('dotenv').config({ path: '.env' });
const client = require("@sendgrid/client");
const path = require('path');
const mysql = require('mysql2/promise');



client.setApiKey(process.env.SENDGRID_API_KEY);





async function addEmailToList(email, listId="e293efbf-2462-4d4b-910a-36145fe80523") {
  if (!email) {
    console.error('addEmailToList called without email');
    return false;
  }

  // ensure we send an identifier field in case the API requires it
  const contactPayload = {
    email: email,
    identifier: email,
  };

  const request = {
    url: `/v3/marketing/contacts`,
    method: 'PUT', // upserts the contact
    body: {
      list_ids: [listId],
      contacts: [
        contactPayload,
      ],
    },
  };

  try {
    const [response, body] = await client.request(request);
    console.log(`Contact add status: ${response.statusCode}`);
    if (response.statusCode === 202) {
      console.log(`Email ${email} successfully added to list ${listId}`);
      return true;
    } else {
      console.error('Failed to add contact:', body);
      return false;
    }
  } catch (error) {
    // print full error for easier debugging
    if (error.response && error.response.body) {
      console.error('Error adding contact:', JSON.stringify(error.response.body, null, 2));
    } else {
      console.error('Error adding contact:', error.message);
    }
    return false;
  }
}


module.exports = addEmailToList;
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node src/addContact.js <email> <listId>');
    console.log('Example: node src/addContact.js joe@example.com 12345');
    process.exit(0);
  }

  const [email] = args;
  (async () => {
    console.log('Running addEmailToList with provided arguments...');
    const ok = await addEmailToList(email);
    process.exit(ok ? 0 : 1);
  })();
}



const pool = mysql.createPool({
  host: process.env.DB_HOST,        // e.g., 'localhost'
  user: process.env.DB_USER,        // e.g., 'root'
  database: process.env.DB_NAME,    // The name of your database
  password: process.env.DB_PASSWORD // Your MySQL password
});


async function getEmailbyId(id) {
  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // The SQL query to select a user by ID
    const query = 'SELECT email FROM potentialUsers WHERE id = ?';
    const values = [id];      

    const [rows] = await connection.execute(query, values);
    if (rows.length > 0) {
      console.log(`Email found for user ID ${id}:`, rows[0].email);
      return rows[0].email;
    } else {
      console.log(`No user found with ID: ${id}`);
      return null;
    }
  } catch (err) {
    console.error('Error executing select query:', err.message);
    return null;
  } finally {
  
    if (connection) {
      connection.release();
    }
  }
}






















/**
 * Adds the email of a potential user (by id) to the SendGrid contact list.
 * @param {number} userId - The id of the user in the potentialUsers table.
 * @param {string} [listId] - Optional SendGrid list ID.
 * @returns {Promise<boolean>}
 */
async function addPotentialUserById(userId, listId="e293efbf-2462-4d4b-910a-36145fe80523") {
    try {
        let email = await getEmailbyId(userId);
        return await addEmailToList(email, listId);
    } catch (err) {
        console.error('Database error at addPotentialUserById:');
        return false;
    }
}





module.exports.addPotentialUserById = addPotentialUserById;