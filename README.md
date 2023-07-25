# DataChunkIpfsUpload

DataChunkIpfsUpload is an MQTT data handling system that saves received data into chunks and uploads them to IPFS (InterPlanetary File System) using the Lighthouse.storage API. This README provides a detailed overview of the project, its files, installation instructions, usage, configuration options, logging details, and license information.

## Table of Contents
- [Introduction](#introduction)
- [Files](#files)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Logging](#logging)
- [License](#license)

## Introduction

DataChunkIpfsUpload is designed to efficiently handle incoming MQTT messages and process them into CSV format. It's particularly useful when the total data size exceeds a specified limit (e.g., 0.5 KB), as the system automatically saves the data into separate chunks to manage large datasets. The chunks are then uploaded to the IPFS using the Lighthouse.storage API, ensuring data integrity and availability in a decentralized network.

## Files

The project consists of the following files:

1. `package.json`: Contains metadata about the project, including dependencies and scripts for running the application.

2. `config.js`: Configures various settings for the application, such as the maximum file size, MQTT broker configuration, and Lighthouse.storage API key.

3. `src/index.js`: The main entry point of the application, responsible for connecting to the MQTT broker, handling incoming messages, and gracefully closing the connection.

4. `src/mqtt/mqttclient.js`: Implements the MQTT client, allowing the application to connect to the specified broker and subscribe to the desired topic for receiving messages.

5. `src/mqtt/mqttConfig.js`: Contains the configuration settings for the MQTT broker, including the broker IP, port, and topic to subscribe.

6. `src/data/csvUtils.js`: Provides a utility function to convert a JavaScript object into a CSV string.

7. `src/data/dataHandler.js`: Handles incoming MQTT messages, converts them into CSV format, saves the data into chunks when required, and uploads the chunks to IPFS.

8. `src/data/logger.js`: Implements the logger using Winston, which records logs in the `error.log` and `combined.log` files.

9. `src/logfiles/error.log` and `src/logfiles/combined.log`: Log files that store the application's logs generated during its execution.

10. `receivedFiles/`: An empty directory used to store the generated chunk files.

## Installation

To install and run DataChunkIpfsUpload, follow these steps:

1. Clone the repository to your local machine:
    ```shell
    git clone https://github.com/BlockOasis/dataChunkIpfsUpload.git
    ```

2. Navigate to the project directory:
    ```shell
    cd dataChunkIpfsUpload
    ```


3. Install the required dependencies:
    ```shell
    npm install
    ```


## Usage

To start the DataChunkIpfsUpload system, use the following command:
```shell
npm start
```

The system will connect to the MQTT broker and begin handling incoming messages. When the total data size exceeds the specified limit, the system saves the data into separate chunk files and uploads them to IPFS using the Lighthouse.storage API. If you need to stop the system gracefully, use `Ctrl+C` to trigger a SIGINT signal, which will close the MQTT connection before exiting the application.

## Configuration

The system uses a configuration file named `config.js` located in the project root directory. Before running the application, ensure that you have set the necessary configurations:

```js
// config.js

module.exports = {
  maxFileSizeBytes: 500, // Adjust this value as needed (0.5 KB in this example)
  mqtt: require('./src/mqtt/mqttConfig'), // MQTT broker configuration
  apiKey: '<Lighthouse.storage API key>', // Replace with your Lighthouse.storage API key
};
```

In the mqttConfig.js file, provide the appropriate MQTT broker information:

```js
// mqttConfig.js

module.exports = {
  brokerIp: '192.168.1.5', // Replace with your MQTT broker IP
  port: 1883, // Default MQTT port
  topic: 'test', // Replace with your desired MQTT topic
};
```

## Logging
The system utilizes Winston for logging. Logs are stored in the `src/logfiles` directory. Two log files are created: `error.log` and `combined.log`. The `error.log` file contains logs with the 'error' level, while the `combined.log` file contains logs with all levels.

