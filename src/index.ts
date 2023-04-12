import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
dotenv.config();

const app = express();
app.use(cors(
    {
        credentials: true
    }
));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);


server.listen(3000, () => {
    console.log('Server started on port 3000');
}
);
mongoose.connect(process.env.MONGO_URL || '');
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
}
);
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongo', err);
}
);

app.use('/', router())


