/**
 * Function that allows to shuffle the data in an array
 * @param {String} array
 * @returns array shuffled
 */
function shuffleArray(array) {
  let actualPosition = array.length;
  while (0 !== actualPosition) {
    const randomPosition = Math.floor(Math.random() * actualPosition);
    actualPosition--;
    [array[actualPosition], array[randomPosition]] = [
      array[randomPosition],
      array[actualPosition],
    ];
  }
  return array;
}
/**
 * function that receives an array of characters scrambles the data to generate random verification codes
 * @param {Number} number lenght of verify code 
 * @returns verificate code to send the user to athenticate
 */
module.exports.generateCode = (number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
  shuffleArray(characters);
  return characters.slice(0, number).join("");
};
