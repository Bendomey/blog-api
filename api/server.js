import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import expressValidator from 'express-validator';

require('dotenv').config({ path: 'variables.env' });
//connect to mongoose
mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        createIndexes: true
    })
    .then(() => {
        console.log('Mongodb connected');
    })
    .catch(err => {
        console.log(err);
    })
    //importing models
require('./models/user.model')
require('./models/blog.model')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

//routes
app.use('/api', require('./routes/index'));

let PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server connected on port ${PORT}`);
});