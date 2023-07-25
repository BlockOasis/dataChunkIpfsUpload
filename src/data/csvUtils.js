// Function to convert a JavaScript object to a CSV string
function convertToCsv(dataObject) {
  const dataArray = [];
  for (const key in dataObject) {
    dataArray.push(dataObject[key]);
  }
  return dataArray.join(',') + '\n';
}

module.exports = {
  convertToCsv,
};
