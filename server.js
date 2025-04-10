const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());

//Database
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('Database Connected...'))
  .catch((err) => {
    console.error('Could not connect to MongoDB..', err);
  });

//Routes
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

//Server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}..`);
});
