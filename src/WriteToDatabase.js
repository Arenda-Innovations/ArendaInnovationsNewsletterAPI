// Import the mysql2/promise module using a named import
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { get } from 'http';
dotenv.config();
// Create a connection pool with your database details
const pool = mysql.createPool({
  host: process.env.DB_HOST,        // e.g., 'localhost'
  user: process.env.DB_USER,        // e.g., 'root'
  database: process.env.DB_NAME,    // The name of your database
  password: process.env.DB_PASSWORD // Your MySQL password
});

async function updatePotentialUserEmail(oldEmail, newEmail) {
  let connection;
  try {

    connection = await pool.getConnection();

    // The SQL query to update the email
    const query = 'UPDATE potentialUsers SET email = ? WHERE email = ?';
    const values = [newEmail, oldEmail];

    // Execute the query
    const [result] = await connection.execute(query, values);

    if (result.affectedRows > 0) {
      console.log(`Successfully updated email for user: ${oldEmail}`);
    } else {
      console.log(`No user found with email: ${oldEmail}`);
    }

  } catch (err) {
    console.error('Error executing update query:', err.message);
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}



async function addPotentialUserWithId(id, email) {
  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // The SQL query to insert a new user with a specific ID
    const query = 'INSERT INTO potentialUsers (id, email) VALUES (?, ?)';
    const values = [id, email];

    // Execute the query
    const [result] = await connection.execute(query, values);

    if (result.affectedRows > 0) {
      console.log(`Successfully added new user with ID: ${id} and email: ${email}`);
    } else {
      console.log(`Failed to add user with ID: ${id}`);
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
       console.error(`Error: User with ID '${id}' or email '${email}' already exists.`);
    } else {
      console.error('Error executing insert query:', err.message);
    }
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

async function getPotentialUserByEmail(email) {
  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // The SQL query to select a user by email
    const query = 'SELECT * FROM potentialUsers WHERE email = ?';
    const values = [email];

    // Execute the query
    const [rows] = await connection.execute(query, values);

    if (rows.length > 0) {
      console.log(`User found:`, rows[0]);
      return rows[0]; // Return the first matching user
    } else {
      console.log(`No user found with email: ${email}`);
      return null;
    }
  } catch (err) {
    console.error('Error executing select query:', err.message);
    return null;
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

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

getEmailbyId('fkjd;ljkfds');