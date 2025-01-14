const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const cors = require('cors');
const { socketServer } = require("./socket");
const bodyParser = require('body-parser');
const { pushNotificationService } = require('./services/pushNotificationService');
dotenv.config();
// const PORT = process.env.PORT || 5000;

const app = express();
// connectDB();

app.use(cors());
app.use(express.json());

// Routes

const server = http.createServer(app);

app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Endpoint to send push notifications
app.post('/send-notification', (req, res) => {
    const { registrationToken, title, body } = req.body;

    // Validate incoming request body
    if (!registrationToken || !title || !body) {
        return res.status(400).json({ message: 'Missing required parameters (registrationToken, title, body).' });
    }

    // Call the function to send the push notification
    pushNotificationService(registrationToken, title, body);

    // Respond with a success message
    res.status(200).json({ message: 'Notification sent successfully' });
});

app.get('/', (req, res) => {
    res.send("Testing ok")
})
socketServer(server);

module.exports = {
    server
};
