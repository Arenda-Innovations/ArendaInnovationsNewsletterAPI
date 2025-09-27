// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import { addPotentialUserById } from './addContact.js';
import { addPotentialUserWithId , getEmailbyId} from './WriteToDatabase.js';
import fs from 'fs/promises'
import sgMail from '@sendgrid/mail';
import { get } from 'http';
const app = express();
dotenv.config();
const port = process.env.PORT ;


console.log(getEmailbyId('vxsamrdpa4'));
// Middleware to parse JSON bodies
app.use(express.json()); 
app.post('/', (req, res) => {
  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  let chosenID = generateRandomId();
  console.log(chosenID);
  console.log(req.body);
  console.log(req.body.email);
  const msg = {
    to: req.body.email, 
    from: 'arenda.innovations@gmail.com', 
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html:`<a href="${process.env.LINK}?{chosenID}">Confirm your email</a>`,
  }
  sgMail
    .send(msg) 
    .then(() => {
      res.send('Email sent'+req.body);
      addPotentialUserWithId(chosenID, req.body.email);  
    })
    .catch((error) => {
      res.send('Error sending email: ' + error.message);
    })
});
const generateRandomId = (length = 36) => {
  return Math.random().toString(36).substring(2, length + 2);
};




app.put('/', (req, res) => {
  
});

//This is the link that they will receive to confirm their email
app.get('/', (req, res) => {
  res.send('Your email has been confirmed, you will receive updates from us soon!');
  console.log(getEmailbyId(req.query.id));
  addPotentialUserById(req.query.id);
  console.log(getEmailbyId(req.query.id));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});