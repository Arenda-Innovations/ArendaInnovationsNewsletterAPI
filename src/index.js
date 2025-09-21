
require('dotenv').config({ path: '.env' });
const client = require("@sendgrid/client");
const path = require('path');


client.setApiKey(process.env.SENDGRID_API_KEY);

/**

 * @param {string} listName 
 * @returns {Promise<string>} 
 */
async function createContactList(listName) {
  const request = {
    url: `/v3/marketing/lists`,
    method: 'POST',
    body: {
      name: listName,
    },
  };

  try {
    const [response, body] = await client.request(request);
    console.log(`List creation status: ${response.statusCode}`);
    if (response.statusCode === 201) {
      console.log(`New list created with ID: ${body.id}`);
      return body.id;
    } else {
      console.error('Failed to create list:', body);
      return null;
    }
  } catch (error) {
    console.error('Error creating list:', error);
    return null;
  }
}

createContactList('Newsletter Subscribers');