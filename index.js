// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import fs from 'fs/promises'

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

// Parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


app.post('/', (req, res) => {
  // sgMail is configured at module startup; use req.body safely now that
  // body-parsing middleware is enabled.
  const msg = {
  to: req.body?.email,
    from: 'arenda.innovations@gmail.com', 
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<div class="grid md:grid-cols-2 gap-8 items-center"><div class="space-y-6"><div class="flex items-center space-x-3 mb-6"><div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center"><img src="/assets/images/ArendaLogo.svg" alt="Logo" width="24" height="28"></div><h3 class="text-2xl font-bold text-white">Our Mission</h3></div><ul class="space-y-6 text-lg md:text-xl text-white/90"><li class="flex items-start space-x-3"><span class="text-blue-400 text-xl mt-1">•</span><span>We are an accelarator for student based research and development projects</span></li><li class="flex items-start space-x-3"><span class="text-purple-400 text-xl mt-1">•</span><span>Developing novel, high-impact STEM projects that shape the future</span></li><li class="flex items-start space-x-3"><span class="text-blue-400 text-xl mt-1">•</span><span>Give students the opportunity to work on Massive Projects and Connect with Industry Experts</span></li><li class="flex items-start space-x-3"><span class="text-purple-400 text-xl mt-1">•</span><span>Guiding students to become world-class innovators and builders</span></li></ul></div><div class="relative aspect-video md:aspect-square flex items-center justify-center hidden md:block"><div class="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-white/5 p-4 flex items-center justify-center"><canvas class="w-full h-full" data-engine="three.js r162" width="386" height="386" style="width: 386px; height: 386px;"></canvas> </div></div></div>',
  }
  sgMail
    .send(msg) 
    .then(() => {
      res.send('Email sent'+req.body);
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

//This is the link that they will receive to confitm their email


app.get('/', (req, res) => {
  res.send('<div>Confirm your email</div>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});