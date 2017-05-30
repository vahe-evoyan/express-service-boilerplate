import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import config from '../config/environment';

const PBKDF_OPTIONS = {
  iterations: 2000,
  keylength: 128,
  algorithm: 'sha512',
};

const JWT_OPTIONS = {
  expiresIn: config.jwt.expires,
  issuer: config.jwt.issuer,
};

/**
 * Generates salt
 *
 * @param  {Integer} Length of the salt
 * @return {String}  Salt
 */
export function generateSalt(length = 64) {
  return crypto.randomBytes(length).toString('base64');
}

/**
 * Hash the given password
 *
 * @param  {String}   password Password
 * @param  {String}   salt     Salt
 * @param  {Callback} callback Callback function
 * @return {String}            Hashed passport
 */
export function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      PBKDF_OPTIONS.iterations,
      PBKDF_OPTIONS.keylength,
      PBKDF_OPTIONS.algorithm,
      (err, key) => {
        if (err) return reject(err);
        return resolve(key.toString('base64'));
      },
    );
  });
}

/**
 * Create JWT token for given user
 *
 * @return {String}      JWT token
 */
export function createJwtToken(payload, options, secret = config.jwt.secret) {
  let jwtOptions = {...JWT_OPTIONS, ...options};
  jwtOptions.jwtid = generateSalt(32);
  console.log(jwtOptions);
  return jwt.sign(payload, secret, jwtOptions);
}
