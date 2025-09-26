require('dotenv').config({ path: '.env' });
const client = require("@sendgrid/client");
const path = require('path');
const { Pool } = require('pg');



client.setApiKey(process.env.SENDGRID_API_KEY);





async function addEmailToList(email, listId="e293efbf-2462-4d4b-910a-36145fe80523") {
  const request = {
    url: `/v3/marketing/contacts`,
    method: 'PUT', // upserts the contact
    body: {
      list_ids: [listId],
      contacts: [
        {
          email: email,
        },
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
    console.error('Error adding contact:', error.response?.body || error.message);
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

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * Adds the email of a potential user (by id) to the SendGrid contact list.
 * @param {number} userId - The id of the user in the potentialUsers table.
 * @param {string} [listId] - Optional SendGrid list ID.
 * @returns {Promise<boolean>}
 */
async function addPotentialUserById(userId, listId) {
    try {
        const res = await pool.query(
            'SELECT email FROM potentialUsers WHERE id = $1',
            [userId]
        );
        if (res.rows.length === 0) {
            console.error(`No user found with id ${userId}`);
            return false;
        }
        const email = res.rows[0].email;
        return await addEmailToList(email, listId);
    } catch (err) {
        console.error('Database error:', err.message);
        return false;
    }
}









module.exports.addPotentialUserById = addPotentialUserById;