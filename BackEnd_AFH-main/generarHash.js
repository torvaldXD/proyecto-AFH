// importar el helper que ya tienes
const bcrypt = require('./app/helpers/handleCrypt.js');

(async () => {
  try {
    // Generar hash para la contraseña "123456"
    const hash = await bcrypt.cryptPassword("123456");
    console.log("Hash generado:", hash);
  } catch (err) {
    console.error("Error generando hash:", err);
  }
})();
