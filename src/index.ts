import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

import connectDB from './db/db'

app.use(cors());
app.use(express.json());

connectDB();

import adminRoutes from './routes/admin';
import userRoutes from './routes/user';

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
