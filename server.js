const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.static('build'));
app.use(express.json());
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

require('./db/connect')

const http = require('http');
const server = http.createServer(app);
const socketIO = require('./socket');

// Initialize Socket.IO
socketIO.init(server);

const routes = require("./routes/index")
app.use("/api/v1",routes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port-${PORT}`);
});
