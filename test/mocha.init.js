require('babel-register');
require('babel-polyfill');

const chai = require('chai');
const sinon  = require('sinon');
const sinonChai = require('sinon-chai');

// Initialize Chai plugins
chai.should();
chai.use(sinonChai);

// Register globals
global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = sinon;

