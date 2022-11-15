const mongoose = require('mongoose');
const app = require('./app');

const URI = process.env.DB_URI || 'mongodb://localhost:27017/';
mongoose.connect(URI, { dbName: 'assignment' }, (err) => {
    err ? console.log(err) : console.log('Connected to DB');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    err ? console.log(err) : console.log('listening on ', PORT);
});
