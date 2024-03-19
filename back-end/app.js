const express = require('express');
const app = express();
const port = 4000;
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
app.use(cors());

const transactionRoutes = require('./routes/transactionRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const barangRoutes = require('./routes/barangRoutes');
const userRoutes = require('./routes/userRoutes');
const authsRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/barangs', barangRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes);
app.use('/auths', authsRoutes)

const server = app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

module.exports = server;
