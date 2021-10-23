const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    port: process.env.PORT || 5000,
    connectionString: process.env.CONNECTION_STRING || undefined
}