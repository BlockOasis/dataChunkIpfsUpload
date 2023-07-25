const mqtt = require('mqtt');
const mqttConfig = require('./mqttConfig');

let client;

async function connect(mqttConfig) {
  return new Promise((resolve, reject) => {
    client = mqtt.connect(`mqtt://${mqttConfig.brokerIp}:${mqttConfig.port}`);
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe(mqttConfig.topic, (err) => {
        if (err) {
          console.error(`Error subscribing to topic: ${err}`);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    client.on('error', (err) => {
      console.error('MQTT error:', err);
      reject(err);
    });

    client.on('close', () => {
      console.log('Disconnected from MQTT broker');
    });
  });
}

function onMessage(messageHandler) {
  client.on('message', (topic, message) => {
    messageHandler(topic, message.toString());
  });
}

async function disconnect() {
  return new Promise((resolve, reject) => {
    if (client) {
      client.end(true, () => {
        resolve();
      });
    } else {
      reject(new Error('MQTT client is not connected'));
    }
  });
}

module.exports = {
  connect,
  onMessage,
  disconnect,
};
