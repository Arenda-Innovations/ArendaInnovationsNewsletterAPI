// One-off test runner to add a contact and print the result.
require('dotenv').config({ path: '.env' });
const addEmailToList = require('./addContact');

(async () => {
  const email = 'namanguggilam@gmail.com';
  const listId = 'e293efbf-2462-4d4b-910a-36145fe80523';
  console.log('Testing addEmailToList for', email, 'list', listId);
  const ok = await addEmailToList(email, listId);
  console.log('Result:', ok ? 'success' : 'failure');
  process.exit(ok ? 0 : 1);
})();
