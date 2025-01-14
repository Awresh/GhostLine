const admin = require('../config/firebase');  // Import Firebase Admin SDK
const logger = require('../utils/logger');

// Function to send push notification to a specific device
const pushNotificationService = (registrationToken, title, body) => {
  // Create the message payload
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: registrationToken, // The device token
  };

  // Send the message using Firebase Admin SDK
  admin
    .messaging()
    .send(message)
    .then((response) => {
      logger.info('Successfully sent message:', response);
    })
    .catch((error) => {
      logger.error('Error sending message:', error);
    });
};

module.exports = { pushNotificationService };
