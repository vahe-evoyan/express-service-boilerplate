require('babel-register');
require('babel-polyfill');

const chai = require('chai');
const sinon  = require('sinon');
const sinonChai = require('sinon-chai');
const chaiThings = require('chai-things');
const chaiDate = require('chai-datetime');

// Initialize Chai plugins
chai.should();
chai.use(sinonChai);
chai.use(chaiThings);
chai.use(chaiDate);

// Register globals
global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = sinon;

