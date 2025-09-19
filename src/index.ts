// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
const port = process.env.PORT ;


app.post('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});