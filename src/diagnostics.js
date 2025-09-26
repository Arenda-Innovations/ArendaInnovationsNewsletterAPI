require('dotenv').config({ path: '.env' });
const client = require('@sendgrid/client');

client.setApiKey(process.env.SENDGRID_API_KEY);

async function getAccount() {
  try {
    const [response, body] = await client.request({ url: '/v3/user/account', method: 'GET' });
    return { response, body };
  } catch (err) {
    return { error: err.response?.body || err.message };
  }
}

async function getContactByEmail(email) {
  try {
    // Try the simple query first
    const [response, body] = await client.request({
      url: `/v3/marketing/contacts?email=${encodeURIComponent(email)}`,
      method: 'GET',
    });
    return { response, body };
  } catch (err) {
    return { error: err.response?.body || err.message };
  }
}

async function getListMembers(listId) {
  try {
    const [response, body] = await client.request({
      url: `/v3/marketing/lists/${listId}/contacts`,
      method: 'GET',
    });
    return { response, body };
  } catch (err) {
    return { error: err.response?.body || err.message };
  }
}

async function run(email, listId) {
  console.log('Running diagnostics...');
  console.log('Email:', email);
  console.log('List ID:', listId);

  const account = await getAccount();
  console.log('\nAccount info:');
  console.log(JSON.stringify(account.body || account, null, 2));

  const contact = await getContactByEmail(email);
  console.log('\nContact lookup by email:');
  console.log(JSON.stringify(contact.body || contact, null, 2));

  const members = await getListMembers(listId);
  console.log('\nList members:');
  console.log(JSON.stringify(members.body || members, null, 2));

  // Print a small diagnostic summary
  console.log('\nSummary:');
  if (contact.body && contact.body.result && contact.body.result.length >= 1) {
    const found = contact.body.result.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
    if (found) {
      console.log(`Contact found with id: ${found.id}`);
      console.log(`List IDs on contact: ${JSON.stringify(found.list_ids || found.listIds || [])}`);
    } else {
      console.log('Contact API returned results but exact email not found in results array.');
    }
  } else if (contact.body && contact.body.contact && contact.body.contact.email) {
    // older API shape
    console.log(`Contact found: ${contact.body.contact.email}`);
  } else {
    console.log('No contact found by email (or API returned unexpected shape).');
  }

  if (members.body && members.body.result) {
    const inList = members.body.result.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
    console.log(inList ? `Email is present in list (id: ${inList.id || inList.contact_id || 'unknown'}).` : 'Email not found among list members in API response.');
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node src/diagnostics.js <email> <listId>');
    process.exit(1);
  }
  run(args[0], args[1]).catch(err => {
    console.error('Diagnostics error:', err);
    process.exit(2);
  });
}
