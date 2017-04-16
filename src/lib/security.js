import crypto from 'crypto';

const PBKDF_OPTIONS = {
  iterations: 2000,
  keylength: 128,
  algorithm: 'sha512',
};

/**
 * Generates salt
 *
 * @param  {Integer} Length of the salt
 * @return {String}  Salt
 */
export function generateSalt(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash the given password
 *
 * @param  {String}   password Password
 * @param  {String}   salt     Salt
 * @param  {Callback} callback Callback function
 * @return {String}            Hashed passport
 */
export function hashPassword(password, salt, callback) {
  return crypto.pbkdf2(
    password,
    salt,
    PBKDF_OPTIONS.iterations,
    PBKDF_OPTIONS.keylength,
    PBKDF_OPTIONS.algorithm,
    (err, key) => {
      if (!err) {
        key = key.toString('hex');
      }
      callback(err, key);
    },
  );
}
