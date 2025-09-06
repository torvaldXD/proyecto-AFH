const User = require("../models/users");
const bcrypt = require("../helpers/handleCrypt");
const code = require("../helpers/handleCodeVerify");
const { generateToken } = require("../helpers/handleToken");
const email = require("../helpers/handleEmails");
const moment = require("moment/moment");

module.exports.getAllUsers = (req, res) => {
  User.find({}).exec(function (err, result) {
    try {
      if (err) {
        res.send({ message: "Error generate in DB" });
      }
      res.send({ docs: result });
      return;
    } catch (error) {
      console.log("Error generate in data base");
    }
  });
};

module.exports.getUser = (req, res) => {
  User.find({ _id: req.params.id }).exec(function (err, result) {
    try {
      if (result[0]) {
        res.send({ success: true, user: result[0] });
      }
    } catch (err) {
      res.send({ message: "User not found" });
    }
  });
};

module.exports.createUser = (req, res) => {
  try {
    User.find({ email: req.body.user.email }).exec(async function (
      err,
      result
    ) {
      if (result[0]) {
        res.status(200).json({
          success: true,
          message: "The user already exists in the database",
        });
        console.log("encotro usuario en la BD");
      } else {
        let passwordGenerate = code.generateCode(7);
        let passwordHash = await bcrypt.cryptPassword(passwordGenerate);

        const user = new User({
          name: req.body.user.name,
          lastName: req.body.user.lastName,
          email: req.body.user.email,
          numberPhone: req.body.user.numberPhone,
          password: passwordHash,
          verifyCode: code.generateCode(5),
          role: req.body.user.role,
          area: req.body.user.area,
          image: "public/storage/archivos/static/Users/user.jpg",
        });

        user.save(function (err, usuarioDB) {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            success: true,
            message: "User created successfully",
          });
          const fechaActual = new Date();
          const opcionesFormato = {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
          };

          let message = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Credenciales de Acceso Sistema AFH",
            text: "Plaintext version of the message",
            attachments: [
              {
                filename: "logo.png",
                path: __dirname + "/../../public/logo.png",
                cid: "logo",
              },
            ],
            html: `<div style="padding: 10px; border-radius: 15px; background-color: #ECEBEA;font-family: 'Arial' !important">
            <table style=" width: 100%; margin: auto;border: 1px solid black; border-collapse: collapse;  ">
              <tbody>
                  <tr >
                      <td style="border: 1px solid black;" rowspan="4"><img style="width: 70px;padding: 1px;display:block;margin:auto;" src="cid:logo" alt="logoAFH"></td>
                      <td style="border: 1px solid black;text-align: center;font-weight: bold;text-transform: uppercase;width: 40%;" rowspan="2">Sistema AFH</td>
                      <td style="border: 1px solid black;padding-left: 10px;width: 33%;" rowspan="4">Fecha: ${fechaActual.toLocaleString(
                        "es-CO",
                        opcionesFormato
                      )}</td>
                  </tr>
                  <tr>
                  </tr>
                  <tr>
                      <td style="border: 1px solid black;text-align: center;" rowspan="4">Creación de Nuevo Usuario</td>
                  </tr>
              </tbody>
          </table>
            <h1 style="text-align: center; font-family: Arial; color:#343475 ;">Creación de Nuevo Usuario</h1>
            <!-- clientes -->
            <p style="padding-left: 10px;">Saludos ${usuarioDB.name}</p>
            <p style="padding-left: 10px;">
              Se realizo una solicitud para el registro de un nuevo usuario: ${
                usuarioDB.email
              } <br>
              <h3 style="padding-left: 10px;">Credenciales de usuario</h3>
              <p style="color: #343475; padding-left: 10px;text-transform: uppercase; font-weight: bold;">
                Email:<h3 style="padding-left: 10px;">${usuarioDB.email}</h3>
              </p>
              <p style="color: #343475; padding-left: 10px;text-transform: uppercase; font-weight: bold;">
                Contraseña Generada:<h3 style="padding-left: 10px;">${passwordGenerate}</h3>
              </p>
              <p style="padding: 10px;">Porfavor inicia sesion dentro del sistema con la contraseña asignada.</p>
            </p>
          </div>`,
          };
          const send = new email({
            service: "afhmetalmecanico.com",
            port: 465,
            host: "afhmetalmecanico.com",
            secure: true,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          });
          send.sendEmail(message);
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.login = (req, res) => {
  User.find({ email: req.body.email }).exec(function (err, result) {
    if (err) {
      res.send({ message: "something wrong" });
    }
    if (result[0]) {
      if (bcrypt.comparePassword(req.body.password, result[0].password)) {
        res.status(200).send({
          success: true,
          message: "sucessfully",
          _id: result[0]._id,
          name: `${result[0].name} ${result[0].lastName}`,
          email: result[0].email,
          role: result[0].role,
          img: result[0].image,
          area: result[0].area,
          date: moment(new Date()).format("YYYY-MM-DD"),
          time: moment(new Date()).format("HH:mm:ss"),
          token: generateToken(result[0]),
        });
        return;
      } else {
        res.send({ success: false, message: "user o password wrong" });
      }
    } else {
      res.send({ success: false, message: "User not register" });
    }
  });
};

module.exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.user.name,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        area: req.body.user.area,
        numberPhone: req.body.user.numberPhone,
      },
    }
  ).exec(function (err, result) {
    try {
      if (err) {
        res.json({ success: false, message: "User not found" });
      } else {
        res
          .status(200)
          .json({ success: true, message: "User updated successfully" });
      }
    } catch (error) {
      console.log("Error generate:", error);
    }
  });
};

module.exports.deleteUser = function (req, res) {
  User.findByIdAndRemove({ _id: req.params.id }).exec(function (err, doc) {
    if (err) {
      res.json({
        success: false,
        message: "something happened in the database",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user deleted successfully",
      });
    }
  });
};

module.exports.forgotPassword = (req, res) => {
  User.find({ email: req.params.email }).exec(async function (err, result) {
    if (err) {
      console.log("generate error", err);
    }
    if (result[0]) {
      let passwordGenerate = code.generateCode(7);
      let passwordHash = await bcrypt.cryptPassword(passwordGenerate);
      User.findOneAndUpdate(
        { _id: result[0]._id },
        {
          $set: {
            password: passwordHash,
          },
        }
      ).exec(function (someError, user) {
        if (someError) {
          console.log("Generate error in BD", someError);
        } else {
          res.status(200).json({
            success: true,
            message: "Password Recovery success",
            email: user.email,
          });
          const fechaActual = new Date();
          const opcionesFormato = {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
          };

          let message = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Recuperación de contraseña Modulo AFH",
            text: "Plaintext version of the message",
            attachments: [
              {
                filename: "logo.png",
                path: __dirname + "/../../public/logo.png",
                cid: "logo",
              },
            ],
            html: `<div style="padding: 10px; border-radius: 15px; background-color: #ECEBEA;font-family: 'Arial' !important">
            <table style=" width: 100%; margin: auto;border: 1px solid black; border-collapse: collapse;  ">
              <tbody>
                  <tr >
                      <td style="border: 1px solid black;" rowspan="4"><img style="width: 70px;padding: 1px;display:block;margin:auto;" src="cid:logo" alt="logoAFH"></td>
                      <td style="border: 1px solid black;text-align: center;font-weight: bold;text-transform: uppercase;width: 40%;" rowspan="2">Sistema AFH</td>
                      <td style="border: 1px solid black;padding-left: 10px;width: 33%;" rowspan="4">Fecha: ${fechaActual.toLocaleString(
                        "es-CO",
                        opcionesFormato
                      )}</td>
                  </tr>
                  <tr>
                  </tr>
                  <tr>
                      <td style="border: 1px solid black;text-align: center;" rowspan="4">Recuperación Contraseña</td>
                  </tr>
              </tbody>
          </table>
            <h1 style="text-align: center; font-family: Arial; color:#343475 ;">Asignación de contraseña</h1>
            <!-- clientes -->
            <p style="padding-left: 10px;">Saludos ${user.name}</p>
            <p style="padding-left: 10px;">
              Se realizo una solicitud para el cambio de contraseña del usuario: ${
                user.email
              } <br>
              <p style="color: #343475; padding-left: 10px;text-transform: uppercase; font-weight: bold;">
                Contraseña Generada:
              </p>
              <h3 style="padding-left: 10px;">${passwordGenerate}</h3>
              <p style="padding: 10px;">Porfavor inicia sesion dentro del sistema con tu nueva contraseña.</p>
            </p>
          </div>`,
          };
          const send = new email({
            service: "afhmetalmecanico.com",
            port: 465,
            host: "afhmetalmecanico.com",
            secure: true,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          });
          send.sendEmail(message);
        }
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }
  });
};

module.exports.updatePassword =  async function (req, res) {
  // console.log("llega vieja", req.body.oldPassword);
  // console.log("llega nueva", req.body.newPassword);
  let passwordHash = await bcrypt.cryptPassword(req.body.newPassword);
  User.find({ _id: req.params.id }).exec(function (err, result) {
    if (err) {
      res.send({ message: "something wrong" });
    }
    if (result[0]) {
      if (bcrypt.comparePassword(req.body.oldPassword, result[0].password) === true ) {
        User.findOneAndUpdate(
          { _id: req.params.id },
          { $set: { password: passwordHash} },
          function (err, passwordupdate) {
            if (err) {
              console.info(err);
              res.send({ message: "something wrong" });
            }else{
              res.json({success: true,message: "Password Update Successfull"});
            }
          }
        );
        
      }else {
        // console.log("No cumple");
        res.send({ success: true, message: "Password Wrong" });
      }
    }else {
      res.send({ success: false, message: "User not register" });
    }
  })
};


module.exports.findByPage = function(req, res) {
  const filters = JSON.parse(req.query.filters);
  // console.log("user",filters);
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 100;
  limite = Number(limite);

  const query = {};

  if (filters.global && filters.global.value) {
    const regex = new RegExp(filters.global.value, "i");
    query["$or"] = [
      { name: regex },
      { email: regex },
      { area: regex },
    ];
  }

  User.find(query)
    .skip(desde)
    .limit(limite)
    .exec(function(err, resultBD) {
      if (err) {
        console.info(err);
        return res.json({
          success: false,
          err
        });
      }
      User.countDocuments(query, function(err, count) {
        if (err) {
          console.info(err);
        }
        res.json({
          success: true,
          totalResults: count,
          docs: resultBD
        });
      });
    });
};
