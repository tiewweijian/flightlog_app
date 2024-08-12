const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();

require('dotenv').config();

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/users', require('./routes/users'));
app.use('/api/flightLogs', require('./routes/flightLogs'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
