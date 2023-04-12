import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';


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

const MONGO_URL = "mongodb+srv://igor:YGdGZViefUXN7yx8@cluster0.yjoms2j.mongodb.net/db_teste?retryWrites=true&w=majority"

server.listen(3000, () => {
    console.log('Server started on port 3000');
}
);
mongoose.connect(MONGO_URL);
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
}
);
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to mongo', err);
}
);

app.use('/', router())


