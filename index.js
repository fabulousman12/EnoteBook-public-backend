const connectToMongo = require('./db.js');
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

connectToMongo();

app.use(express.json())
// app.use(cors())
app.use(cors({
  origin: 'http://localhost:3000', // Allow only this origin
  methods: ['GET', 'POST'], // Allow only these methods
  allowedHeaders: ['Content-Type', 'auth'] // Allow only these headers
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/img', require('./routes/Image'));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
