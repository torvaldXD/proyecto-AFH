const bcrypt = require("bcrypt");

/**
 * function cryptPassword in charge of encrypting passwords
 * @param {String} passwordText
 * @returns hash password encrypt with jump 10
 */
module.exports.cryptPassword = async (passwordText) => {
  try {
    let passwordEncrypt = await bcrypt.hashSync(passwordText, 12);
    return passwordEncrypt;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * function comparePassword to login user
 * @param {String} passwordText
 * @param {String} passwordHash
 * @returns boolean if its the equals password
 */
module.exports.comparePassword = (passwordText, passwordHash) => {
  return bcrypt.compareSync(passwordText, passwordHash);
};
