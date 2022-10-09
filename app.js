import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';

// extra security packages
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit';


import express from 'express';
const app = express();

//connectDB
import connectDB from './db/connect.js';

import authenticateUser from './middleware/authentication.js';

//routers
import authRouter from './router/auth.js';
import jobsRouter from './router/jobs.js';

// error handler 
import notFound from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

//routes
app.use(express.json());

//security
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
}))


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);


app.use(notFound);
app.use(errorHandlerMiddleware);

const port = 80;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
}

start();