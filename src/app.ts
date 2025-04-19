import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import cors from 'cors';
import apiRoutesV1 from '@/routes';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Settings
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
// Settings End

//connecting the database
const URL: string = process.env.MONGODB_URL || '';

//mongoDB configurations
mongoose.connect(URL, {});

//creating the connection
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB Connection Successful');
});

// Routes
app.use('/api/v1', apiRoutesV1);
// Routes End

const port = Number(process.env.PORT) || 8081;

app.listen(port, () => {
  console.log(`[+] Server started on port ${port}`);
});
