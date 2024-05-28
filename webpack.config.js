const path = require('path');

module.exports = {
  entry: '../js/routing.js', // Entry point of your client-side JavaScript file
  output: {
    filename: 'bundle.js', // Output bundle file
    path: path.resolve(__dirname, 'public') // Output directory
  }
};
