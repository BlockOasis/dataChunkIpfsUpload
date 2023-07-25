const fs = require('fs');
const path = require('path');
const csvUtils = require('./csvUtils');
const logger = require('./logger');
const lighthouse = require('@lighthouse-web3/sdk');
const config = require('../../config');

let receivedData = ''; // Variable to store received data as a CSV string
let isFirstLine = true; // Flag to indicate if it's the first line of the received data

// Function to convert a JavaScript object to a CSV string
function convertToCsv(dataObject) {
  const dataArray = [];
  for (const key in dataObject) {
    dataArray.push(dataObject[key]);
  }
  return dataArray.join(',') + '\n';
}

const uploadChunkToIPFS = async (chunkFileDirectory) => {
  try {
    const uploadResponse = await lighthouse.upload(chunkFileDirectory, config.apiKey);

    // Log the IPFS hash of the uploaded file
    logger.info(`Uploaded chunk to IPFS. IPFS Hash: ${uploadResponse.data.Hash}`);
  } catch (err) {
    logger.error(`Error uploading chunk to IPFS: ${err.message}`);
  }
};

// Function to handle incoming MQTT messages
function handleIncomingMessage(topic, message) {
  try {
    const jsonMessage = JSON.parse(message);

    // Add timestampAtAggregator field with the current timestamp in seconds
    jsonMessage.timestampAtAggregator = Math.floor(Date.now() / 1000);

    // Convert the message to a CSV string
    const csvString = convertToCsv(jsonMessage);

    // Check if appending the CSV string would exceed the maximum file size
    const totalSize = receivedData.length + csvString.length;
    if (totalSize >= config.maxFileSizeBytes) {
      // Save the current receivedData as a chunk file with timestamp in the name
      const timestamp = Date.now();
      const chunkFileDirectory = path.join(__dirname, `../../receivedFiles/chunk-${timestamp}`);
      const chunkFileName = `chunk-${timestamp}.csv`;
      const chunkFilePath = path.join(chunkFileDirectory, chunkFileName);

      // Create the directory if it doesn't exist
      if (!fs.existsSync(chunkFileDirectory)) {
        fs.mkdirSync(chunkFileDirectory);
      }

      fs.promises.writeFile(chunkFilePath, receivedData)
        .then(() => uploadChunkToIPFS(chunkFileDirectory))
        .catch((err) => {
          logger.error(`Error saving chunk file: ${err}`);
        });

      // Reset isFirstLine flag to true to start writing attribute names in the new file
      isFirstLine = true;

      // Clear receivedData to start receiving new data in the variable
      receivedData = '';
    }

    // Add attribute names as the first line if it's the beginning of the data
    if (isFirstLine) {
      const attributeNames = Object.keys(jsonMessage);
      receivedData += attributeNames.join(',') + '\n';
      isFirstLine = false;
    }

    // Append the CSV string to receivedData
    receivedData += csvString;

    // Log the current state after updating receivedData
    logger.info(`Current state after update:\n${receivedData}`);
  } catch (err) {
    logger.error(`Error processing MQTT message: ${err}`);
  }
}

module.exports = {
  handleIncomingMessage,
};
