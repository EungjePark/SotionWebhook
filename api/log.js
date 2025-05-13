// api/logs.js
const { logs } = require('../logsStore');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(logs);
};