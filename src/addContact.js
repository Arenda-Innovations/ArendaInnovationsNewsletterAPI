require('dotenv').config({ path: '.env' });
const client = require("@sendgrid/client");
const path = require('path');



client.setApiKey(process.env.SENDGRID_API_KEY);
/**
 * @param {string} email - The email address to add
 * @param {string} listId - The ID of the contact list
 * @returns {Promise<boolean>}
 */
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

// Export the function so other modules can require/import it without
// triggering network requests during module initialization.
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