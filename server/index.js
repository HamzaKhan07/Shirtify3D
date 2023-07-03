import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import dalleRoutes from './routes/dalle.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', function(req, res){
    res.status(200).json("Welcome to Server");
})

app.listen(3000, function(){
    console.log('listening on port 3000');
})