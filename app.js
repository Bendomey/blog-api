// I am using this module just to enable the higher verison of 
// JS 
require = require("esm")(module /*, options */ , );

// then finally I export the whole application to the 
// node engine to work with
module.exports = require("./api/server.js");