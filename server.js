import express from 'express';
import dotenv from "dotenv";
import connectToMongoDB from './db/connectToMongoDB.js';

import listRoute from './routes/list.routes.js';
import userRoute from './routes/user.route.js';
import emailRoute from './routes/email.route.js';
import cors from 'cors';



const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;


app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.use(express.json());

app.use('/api', listRoute);
app.use('/api', userRoute);
app.use('/api', emailRoute);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});