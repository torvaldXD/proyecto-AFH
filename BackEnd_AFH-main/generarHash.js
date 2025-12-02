// importar el helper que ya tienes
const bcrypt = require('./app/helpers/handleCrypt.js');

(async () => {
  try {
    // Generar hash para la contraseña "admin12345"
    const hash = await bcrypt.cryptPassword("admin12345");
    console.log("Hash generado:", hash);
  } catch (err) {
    console.error("Error generando hash:", err);
  }
})();
