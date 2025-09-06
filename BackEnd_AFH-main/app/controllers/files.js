const fs = require("fs");
const fsPromise = require("fs").promises;
const Files = require("../models/files");
const Quotes = require("../models/quotes");
const Codes = require("../models/codetool");
const CodesQuote = require("../models/codeQuote");
const mime = require("mime-types");

const puppeteer = require("puppeteer");
const path = require("path");

/****Subida de imagenes  */
module.exports.uploadsImageTools = (req, res) => {
  let files = [];
  files.push(...req.files.archivos);
  var status = false;
  for (let i = 0; i < files.length; i++) {
    fs.mkdir(
      "public/storage/archivos/" + req.body.dir,
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );

    setTimeout(() => {
      req.body.path =
        "public/storage/archivos/" + req.body.dir + "/" + files[i].name;
      req.body.url =
        "public/storage/archivos/" + req.body.dir + "/" + files[i].name;

      fs.rename(
        files[i].path,
        "public/storage/archivos/" + req.body.dir + "/" + files[i].name,
        (err) => {
          if (err) {
            throw err;
          } else {
            let datos = {
              titulo: req.body.titulo,
              descripcion: req.body.descripcion,
              idObjeto: req.body.idObjeto,
              type: files[i].type,
              size: files[i].size,
              path:
                "public/storage/archivos/" + req.body.dir + "/" + files[i].name,
              url:
                "public/storage/archivos/" + req.body.dir + "/" + files[i].name,
              ext: files[i].name.split(".").pop(),
              dir: req.body.dir,
              filename: files[i].name,
              name: files[i].name,
              originalFilename: files[i].originalFilename,
            };

            let archivo = new Files(datos);
            archivo.save(function (err, doc) {
              if (err) {
                console.log("se genero une rror", err);
                status = false;
              }
              // console.log("funciono");
              status = true;
            });
          }
          // console.log(status);
          console.info(
            "File copy ok: public/storage/archivos/" +
              req.body.dir +
              "/" +
              files[i].name
          );
        }
      );
    }, 100);
  }
  // console.log(status);
  setTimeout(() => {
    if (status === true) {
      res.json({
        success: true,
        status: 200,
        message: "Operación exitosa",
      });
    } else {
      res.json({
        success: false,
        status: 500,
        message: "Error inesperado",
      });
    }
  }, 300);
};

module.exports.getPdfQuotes = (req, res) => {
  const filePath = req.body.path;

  console.log("ruta llega", filePath);

  // Obtiene la ruta absoluta del archivo
  const absolutePath = path.resolve(filePath);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=archivo.pdf");

  // Envía el archivo PDF como respuesta
  res.sendFile(absolutePath);
  console.log("se envio archivo");
};

/* Actualizacion de archivo imagen herramienta */
module.exports.updateImageTools = function (req, res) {
  const pathStatic = "public/storage/archivos/Tools/static/tool.png";
  let files = [];
  files.push(...req.files.archivos);
  /**Eliminacion del archivo anterior */
  if (req.body.pathAnterior !== pathStatic) {
    fsPromise
      .unlink(req.body.pathAnterior)
      .then(() => {
        console.log("File removed");
      })
      .catch((err) => {
        console.error("Something wrong happened removing the file");
      });
  }
  for (let i = 0; i < files.length; i++) {
    fs.mkdir(
      "public/storage/archivos/" + req.body.dir,
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );
    setTimeout(() => {
      req.body.path =
        "public/storage/archivos/" + req.body.dir + "/" + files[i].name;
      req.body.url =
        "public/storage/archivos/" + req.body.dir + "/" + files[i].name;

      fs.rename(
        files[i].path,
        "public/storage/archivos/" + req.body.dir + "/" + files[i].name,
        (err) => {
          if (err) {
            throw err;
          } else {
            Files.findOneAndUpdate(
              { idObjeto: req.body.idObjeto },
              {
                $set: {
                  path:
                    "public/storage/archivos/" +
                    req.body.dir +
                    "/" +
                    files[i].name,
                  url:
                    "public/storage/archivos/" +
                    req.body.dir +
                    "/" +
                    files[i].name,
                  ext: files[i].name.split(".").pop(),
                  dir: req.body.dir,
                  filename: files[i].name,
                  name: files[i].name,
                  originalFilename: files[i].originalFilename,
                  type: files[i].type,
                  size: files[i].size,
                },
              },
              { upsert: true },
              function (err, doc) {
                if (err) {
                  console.info("error update archivo: " + err);
                  res.json({
                    success: false,
                    message: "error",
                  });
                } else {
                  res.send({
                    success: true,
                    message: "Operación exitosa",
                  });
                }
              }
            );
          }
          console.log("Rename File complete!");
        }
      );
    }, 500);
  }
};

/***Delete file*** */
module.exports.deleteFileTools = function (req, res) {
  let folderD = req.query.path.split("/");
  // let pathSuccess=++++;
  let pathSuccess = `public/storage/archivos/Tools/${folderD[4]}`;

  Files.findOneAndRemove({ idObjeto: req.params.id }, function (err, doc) {
    if (err) {
      console.info("error update archivo: " + err);
      res.json({
        message: "error",
        err,
      });
    } else {
      /**Eliminacion del archivo anterior y elimina folder*/
      fsPromise
        .unlink(req.query.path)
        .then(() => {
          console.info("File removed path: " + req.query.path);
          fs.rmdir(pathSuccess, function (err, succes) {
            if (err) {
              console.log("ocurrio un error");
            }
            console.log("Eliminacion de carpeta exitosa");
          });
        })
        .catch((err) => {
          console.info("Something wrong happened removing the file " + err);
        });
      Codes.findOneAndRemove({ code: req.params.id }).exec(function (err, doc) {
        if (err) {
          console.log("Ocurrio algo eliminando el codigo", err);
        } else {
          console.log("Se elimino el codigo ingresado");
        }
      });
      res.send({
        success: true,
        message: "Operación exitosa",
        doc,
      });
    }
  });
};

module.exports.createPDFQuotes = async (req, res) => {
  let listaItems = req.body.quotes.items;
  let listaContractor = req.body.quotes.contractor.split(";");
  let listaScope = req.body.quotes.scope.split(";");
  let listaEmployer = req.body.quotes.employer.split(";");
  let htmlTableItems = [];
  let totalPriceItems = 0;
  fs.mkdir(
    "public/storage/archivos/Quotes/" + req.body.quotes.code,
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );
  //items
  for (let index = 0; index < listaItems.length; index++) {
    // listaItems[index].fullValue=parseInt(listaItems[index].unitValue)*parseInt(listaItems[index].amount)
    rowdataItems =
      '<tr style="text-align: center;">' +
      "<td >" +
      listaItems[index].number +
      "</td>" +
      '<td style="width: 35%; text-align: justify;">' +
      listaItems[index].description +
      "</td>" +
      "<td >" +
      listaItems[index].unit +
      "</td>" +
      "<td >" +
      listaItems[index].amount +
      "</td>" +
      "<td >" +
      formatDecimalCOP(listaItems[index].unitValue)
       +
      "</td>" +
      "<td >" +
      formatDecimalCOP(listaItems[index].fullValue) +
      "</td>" +
      "</tr>";

    htmlTableItems.push(rowdataItems);

    totalPriceItems += parseInt(listaItems[index].fullValue);
  }
  //comercial conditions

  let rowdataContractor = "";

  for (let index = 0; index < listaContractor.length - 1; index++) {
    rowdataContractor += `<li>${listaContractor[index].trim()}</li>`;
  }

  let contratorList = `<ul>${rowdataContractor}</ul>`;
  //employer
  let rowdataEmployer = "";

  for (let index = 0; index < listaEmployer.length - 1; index++) {
    rowdataEmployer += `<li>${listaEmployer[index].trim()}</li>`;
  }

  let employerList = `<ul>${rowdataEmployer}</ul>`;

  let htmlReady = htmlTableItems.join("");

  let listDataScope= "";
  let listScopeHTML = "";

  if(listaScope!==0){
    for (let index = 0; index < listaScope.length - 1; index++) {
      listDataScope += `<li>${listaScope[index].trim()}</li>`;
    }
    listScopeHTML = `<ol start="1">${listDataScope}</ol>`;
  }


  
  //create pdf

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const imgLogoPath = path.join(__dirname, "../../public/logo.png");
  const imgLogoData = fs.readFileSync(imgLogoPath, "base64");
  const imgLogoBase64 = `data:image/png;base64,${imgLogoData}`;
  const imgFirmPath = path.join(__dirname, "../../public/firma.png");
  const imgFirmData = fs.readFileSync(imgFirmPath, "base64");
  const imgFirmBase64 = `data:image/png;base64,${imgFirmData}`;

  let fecha = formatDate(new Date());
  const fechaFormateada = formatDateString(new Date());
  let pageNumber = 1;
  let pageNumberTotal = 2;

  const headerContent = `
        <div style="padding-top: 5%">
        <table style="border: 1px solid black; border-collapse: collapse; width: 80%; margin: auto;">
          <tbody>
            <tr >
                <td class="logo" rowspan="4"><img style="" src="${imgLogoBase64}"><span>Documento vigente</span></td>
                <td class="colum2Tittle" rowspan="2">Cotizaciones</td>
                <td><strong>Código: </strong> F-GC-05</td>
            </tr >
            <tr>
                <td class="textoTable"><strong>Fecha de Creación:</strong> ${fecha}</td>
            </tr>
            <tr >
                <td class="colum2Body" rowspan="2">Version - 01</td>
                <td class="textoTable"><strong>Fecha de Revisión:</strong> ${fecha}</td>
            </tr>
            <tr >
                <td><strong>Pagina ${pageNumber} de ${pageNumberTotal}</strong></td>
            </tr>
          </tbody>
        </table>
        </div>
      `;

  const footerContent = `
        <div>
          <span>Carrera 13 A # 40 - 37 B/Primero de Mayo, Palmira - Colombia <br>Cel (+57) 311 616 7972 | Fijo (602) 287 2362<br></span>
          <span style="font-size: 13.63px;">afh@afhmetalmecanico.com<br>www.afhmetalmecanico.com</span>
        </div>
      `;

  const bodyContent = `
        <div style="padding-left: 8%;" >
          <h1 style="text-align: center; font-family: Arial; font-size: 14.63px;">COTIZACION N.º ${req.body.quotes.code}</h1>
          <!-- clientes -->
          <p>Palmira, ${fechaFormateada}</p>
          <p>
            Señores: <br>
            <strong style="text-transform: uppercase;" >${req.body.quotes.client.name}</strong><br>
            <strong >Atn ${req.body.quotes.addressedTo}</strong><br>
            ${req.body.quotes.area}
          </p>
          <!-- agradecimiento -->
    
          <p >Agradeciéndole de antemano su amable invitación para cotizarle el siguiente trabajo: <br>
            <strong >“${req.body.quotes.project}”</strong>
          </p>
    
          <!-- Alcance -->
    
          <p style="margin: 0; font-weight: bold;">ALCANCE DE LA OFERTA.</p>
          <p >A.F.H Metalmecánico S.A.S, ofrece el suministro de personal con experiencia, para desarrollar trabajo, dirección técnica y supervisión, concerniente a: 
            <strong class="negrita">“${req.body.quotes.project}”</strong></p>
          </p>
          ${listScopeHTML}
          <!-- Items -->
          
          <table style="width: 90%; padding-top: 50px; padding-bottom: 50px;">
            <thead>
              <tr style="text-align: center; font-weight: bold;">
                <td>ITEM</td>
                <td>DESCRIPCIÓN</td>
                <td>UNID</td>
                <td>CANT</td>
                <td>VALOR<BR>UNITARIO</td>
                <td>VALOR<BR>TOTAL</td>
              </tr>
            </thead>
            <tbody>
              <tr style="text-align: center;">
                ${htmlReady}
              </tr>
              <tr>
                  <td colspan="5" style="text-align: right; padding-right: 15px; text-transform: uppercase; font-weight: bold;" >Total</td>
                  <td style="text-align: center;" >${formatDecimalCOP(totalPriceItems)}</td>
              </tr>
          </tbody>
          </table>
    
    
          <!-- IVA -->
          <p>Este valor mas IVA</p>
        </div>
        `;

  const moreContent = `
      <div style="padding-left: 8%;">  
      <!-- CONDICIONES COMERCIALES -->
      <br>
      <p><strong style="text-decoration: underline;">CONDICIONES COMERCIALES</strong></p>
      
      <div>
        <p><strong >CORRE POR CUENTA DEL CONTRATISTA</strong></p>
        ${contratorList}
      </div>
      <br>
      <div>
        <p><strong >CORRE POR CUENTA DEL CONTRATANTE</strong></p>
        ${employerList}
      </div>
      <br>
      <!-- forma de pago -->
      <div>
        <p><strong >FORMA DE PAGO</strong></p>
        <P>Nos permitimos solicitar la siguiente forma de pago:</p>
        <ul >
          <li style="padding: 3px;">${req.body.quotes.pay} después de entregar labores asignadas.</li>
        </ul>
      </div>
      <!-- plazo entrega -->
      <div>
        <p><strong >PLAZO DE ENTREGA</strong></p>
        <P>El tiempo estimado para la realización de los trabajos es de ${req.body.quotes.deliveryTime} hábiles.</p>
      </div>
      <!-- validez propuesta -->
      <div>
        <p><strong >VALIDEZ DE LA PROPUESTA</strong></p>
        <P>La propuesta es válida hasta 30 días después de emitida.</p>
       
      </div>
      <!-- agradecimientos -->
      <P>
        Agradecemos su amable atención a la presente, esperamos que nuestra oferta cumpla sus requerimientos y gustosamente les atenderemos para cualquier aclaración al respecto.<br>Atentamente,
      </P>
    
      <div>
        <img src="${imgFirmBase64}" >
        <p><strong>ANDRES FELIPE HERNANDEZ</strong><br>Gerente General  </p>
      </div><div>`;

  await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              @page {
                margin: 0;
                size: A4;
              }
              @media print {
    
                .textoTable{
                    font-size: 13.40px !important;
                }
                table,th,td {
                  border: 1px solid black;
                  border-collapse: collapse;
                }
                body {
                  margin: 1cm;
                  font-family: 'Arial' !important;
                  font-size: 14.63px !important;
                }
                .headerct {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 100px;
                  background-color: white;
                  font-size: 14.63px !important;
                  color: #000000;
                }
                .content {
                  padding-top: 15%;
                }
                .footer {
                  position: fixed;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  padding-right:20px;
                  height: 100px;
                  background-color: white;
                  font-size: 14.63px !important;
                  color: #828282;
                  text-align: right;
                  font-weight: bold;
                }
                .
                .colum2Tittle{
                  text-align: center;
                  font-weight: bold;
                  text-transform: uppercase;
                  width: 40%;
                }
                .negrilla{
                    font-weight: bold;
                    padding-right: 3px;
                    padding-left: 10px;
                }
                .logo{
                  vertical-align: middle;
                  text-align: center;
                }
            
                .logo span {
                  display: block;
                  text-align: center;
                  font-weight: bold;
                  font-size: 12.40px !important;
                  color: green;
                  padding-top: 2px;
                  padding-bottom: 2px;
                  text-transform: uppercase;
                }
                .logo img{
                  width: 68px;
                  padding-bottom: 1px;
                  padding-top: 1px;
                }
                .colum2Tittle{
                    text-align: center;
                    font-weight: bold;
                    text-transform: uppercase;
                    width: 40%;
                  }
                  .colum2Body{
                    text-align: center;
                  }
                /* Establecer el formato para la primera página */
                @page :first {
                  .header {
                    display: block
                  }
                }
                /* Establecer el formato para las páginas siguientes */
                @page :left {
                  .header {
                    display: fixed;
                  }
                }
                .more-content {
                  page-break-before: always;
                }
              }
            </style>
          </head>
          <body>
            <div class="headerct">
              ${headerContent}
            </div>
            <div class="content">
              ${bodyContent}
            </div>
            <div class="footer">
              ${footerContent}
            </div>
            <div style="padding-top: 20%;" class="more-content">
              ${moreContent}
            </div>
          </body>
        </html>
      `);

  // Reemplaza con la ruta y nombre de tu archivo

  // Obtener información del archivo
  let quoteCode = req.body.quotes.code;

  await page.pdf({
    path: `public/storage/archivos/Quotes/${quoteCode}/${quoteCode}.pdf`,
    format: "A4",
    printBackground: true,
  });
  await browser.close();

  setTimeout(() => {
    SaveQuoteBD(req.body.quotes, "")
      .then((response) => {
        const { estado, docBD } = response;
        // console.log("Estado:", estado);
        // console.log("doc deelve:", docBD);
        let myDateCO = new Date();
        let listFilesPDF = [];
        listFilesPDF.push({
          rute: docBD.path,
          name: docBD.name,
          creationDate: myDateCO.toLocaleDateString("es-CO"),
          timeCreated: myDateCO.toLocaleTimeString("es-CO"),
          clientName: req.body.quotes.client.name,
        });
        Quotes.findOneAndUpdate(
          { code: docBD.idObjeto },
          {
            $set: {
              files: listFilesPDF,
            },
          }
        ).exec(function (err, result) {
          try {
            if (err) {
              console.log("No actualizo QUote con archivos", err);
            } else {
              console.log("se actualizo los archivos de la Cotizacón");
            }
          } catch (error) {
            console.log("Error generate: guardar files cotizacion", error);
          }
        });
        res.json({
          success: true,
          status: 200,
          message: "Create PDF Quote successfull",
          doc: docBD,
        });
      })
      .catch((error) => {
        res.json({
          success: false,
          status: 500,
          message: "Error inesperado",
        });
        console.error("Error:", error);
        // Manejar el error aquí
      });
  }, 300);
};

module.exports.updatePDFQuotes = async (req, res) => {
  let listaItems = req.body.quotes.items;
  let listaContractor = req.body.quotes.contractor.split(";");
  let listaScope = req.body.quotes.scope.split(";");
  let listaEmployer = req.body.quotes.employer.split(";");
  let htmlTableItems = [];
  let totalPriceItems = 0;
  fs.mkdir(
    "public/storage/archivos/Quotes/" + req.body.quotes.code,
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );
  //items
  for (let index = 0; index < listaItems.length; index++) {
    // listaItems[index].fullValue=parseInt(listaItems[index].unitValue)*parseInt(listaItems[index].amount)
    rowdataItems =
      '<tr style="text-align: center;">' +
      "<td >" +
      listaItems[index].number +
      "</td>" +
      '<td style="width: 35%;text-align: justify;">' +
      listaItems[index].description +
      "</td>" +
      "<td >" +
      listaItems[index].unit +
      "</td>" +
      "<td >" +
      listaItems[index].amount +
      "</td>" +
      "<td >" +
      formatDecimalCOP(listaItems[index].unitValue)+
      "</td>" +
      "<td >" +
      formatDecimalCOP(listaItems[index].fullValue) +
      "</td>" +
      "</tr>";

    htmlTableItems.push(rowdataItems);

    totalPriceItems += parseInt(listaItems[index].fullValue);
  }
  //comercial conditions

  let rowdataContractor = "";

  for (let index = 0; index < listaContractor.length - 1; index++) {
    rowdataContractor += `<li>${listaContractor[index].trim()}</li>`;
  }

  let contratorList = `<ul>${rowdataContractor}</ul>`;
  //employer
  let rowdataEmployer = "";

  for (let index = 0; index < listaEmployer.length - 1; index++) {
    rowdataEmployer += `<li>${listaEmployer[index].trim()}</li>`;
  }

  let employerList = `<ul>${rowdataEmployer}</ul>`;

  let htmlReady = htmlTableItems.join("");

  let listDataScope= "";
  let listScopeHTML = "";

  if(listaScope!==0){
    for (let index = 0; index < listaScope.length - 1; index++) {
      listDataScope += `<li>${listaScope[index].trim()}</li>`;
    }
    listScopeHTML = `<ol start="1">${listDataScope}</ol>`;
  }
  //create pdf

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const imgLogoPath = path.join(__dirname, "../../public/logo.png");
  const imgLogoData = fs.readFileSync(imgLogoPath, "base64");
  const imgLogoBase64 = `data:image/png;base64,${imgLogoData}`;
  const imgFirmPath = path.join(__dirname, "../../public/firma.png");
  const imgFirmData = fs.readFileSync(imgFirmPath, "base64");
  const imgFirmBase64 = `data:image/png;base64,${imgFirmData}`;

  let fecha = formatDate(new Date());
  const fechaFormateada = formatDateString(new Date());
  let pageNumber = 1;
  let pageNumberTotal = 2;

  const headerContent = `
        <div style="padding-top: 5%">
        <table style="border: 1px solid black; border-collapse: collapse; width: 80%; margin: auto;">
          <tbody>
            <tr >
                <td class="logo" rowspan="4"><img style="" src="${imgLogoBase64}"><span>Documento vigente</span></td>
                <td class="colum2Tittle" rowspan="2">Cotizaciones</td>
                <td><strong>Código: </strong> F-GC-05</td>
            </tr >
            <tr>
                <td class="textoTable"><strong>Fecha de Creación:</strong> ${fecha}</td>
            </tr>
            <tr >
                <td class="colum2Body" rowspan="2">Version - 01</td>
                <td class="textoTable"><strong>Fecha de Revisión:</strong> ${fecha}</td>
            </tr>
            <tr >
                <td><strong>Pagina ${pageNumber} de ${pageNumberTotal}</strong></td>
            </tr>
          </tbody>
        </table>
        </div>
      `;

  const footerContent = `
        <div>
          <span>Carrera 13 A # 40 - 37 B/Primero de Mayo, Palmira - Colombia <br>Cel (+57) 311 616 7972 | Fijo (602) 287 2362<br></span>
          <span style="font-size: 13.63px;">afh@afhmetalmecanico.com<br>www.afhmetalmecanico.com</span>
        </div>
      `;

  const bodyContent = `
        <div style="padding-left: 8%;" >
          <h1 style="text-align: center; font-family: Arial; font-size: 14.63px;">COTIZACION N.º ${req.body.quotes.code}</h1>
          <!-- clientes -->
          <p>Palmira, ${fechaFormateada}</p>
          <p>
            Señores: <br>
            <strong style="text-transform: uppercase;" >${req.body.quotes.client.name}</strong><br>
            <strong >Atn ${req.body.quotes.addressedTo}</strong><br>
            ${req.body.quotes.area}
          </p>
          <!-- agradecimiento -->
    
          <p >Agradeciéndole de antemano su amable invitación para cotizarle el siguiente trabajo: <br>
            <strong >“${req.body.quotes.project}”</strong>
          </p>
    
          <!-- Alcance -->
    
          <p style="margin: 0; font-weight: bold;">ALCANCE DE LA OFERTA.</p>
          <p >A.F.H Metalmecánico S.A.S, ofrece el suministro de personal con experiencia, para desarrollar trabajo, dirección técnica y supervisión, concerniente a: 
            <strong class="negrita">“${req.body.quotes.project}”</strong></p>
          </p>
          ${listScopeHTML}
          <!-- Items -->
          
          <table style="width: 90%; padding-top: 50px; padding-bottom: 50px;">
            <thead>
              <tr style="text-align: center; font-weight: bold;">
                <td>ITEM</td>
                <td>DESCRIPCIÓN</td>
                <td>UNID</td>
                <td>CANT</td>
                <td>VALOR<BR>UNITARIO</td>
                <td>VALOR<BR>TOTAL</td>
              </tr>
            </thead>
            <tbody>
              <tr style="text-align: center;">
                ${htmlReady}
              </tr>
              <tr>
                  <td colspan="5" style="text-align: right; padding-right: 15px; text-transform: uppercase; font-weight: bold;" >Total</td>
                  <td style="text-align: center;" >${formatDecimalCOP(totalPriceItems)}</td>
              </tr>
          </tbody>
          </table>
    
    
          <!-- IVA -->
          <p>Este valor mas IVA</p>
        </div>
        `;

  const moreContent = `
      <div style="padding-left: 8%;">  
      <!-- CONDICIONES COMERCIALES -->
      <br>
      <p><strong style="text-decoration: underline;">CONDICIONES COMERCIALES</strong></p>
      
      <div>
        <p><strong >CORRE POR CUENTA DEL CONTRATISTA</strong></p>
        ${contratorList}
      </div>
      <br>
      <div>
        <p><strong >CORRE POR CUENTA DEL CONTRATANTE</strong></p>
        ${employerList}
      </div>
      <br>
      <!-- forma de pago -->
      <div>
        <p><strong >FORMA DE PAGO</strong></p>
        <P>Nos permitimos solicitar la siguiente forma de pago:</p>
        <ul >
          <li style="padding: 3px;">${req.body.quotes.pay} después de entregar labores asignadas.</li>
        </ul>
      </div>
      <!-- plazo entrega -->
      <div>
        <p><strong >PLAZO DE ENTREGA</strong></p>
        <P>El tiempo estimado para la realización de los trabajos es de ${req.body.quotes.deliveryTime} hábiles.</p>
      </div>
      <!-- validez propuesta -->
      <div>
        <p><strong >VALIDEZ DE LA PROPUESTA</strong></p>
        <P>La propuesta es válida hasta 30 días después de emitida.</p>
       
      </div>
      <!-- agradecimientos -->
      <P>
        Agradecemos su amable atención a la presente, esperamos que nuestra oferta cumpla sus requerimientos y gustosamente les atenderemos para cualquier aclaración al respecto.<br>Atentamente,
      </P>
    
      <div>
        <img src="${imgFirmBase64}" >
        <p><strong>ANDRES FELIPE HERNANDEZ</strong><br>Gerente General  </p>
      </div><div>`;

  await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              @page {
                margin: 0;
                size: A4;
              }
              @media print {
    
                .textoTable{
                    font-size: 13.40px !important;
                }
                table,th,td {
                  border: 1px solid black;
                  border-collapse: collapse;
                }
                body {
                  margin: 1cm;
                  font-family: 'Arial' !important;
                  font-size: 14.63px !important;
                }
                .headerct {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 100px;
                  background-color: white;
                  font-size: 14.63px !important;
                  color: #000000;
                }
                .content {
                  padding-top: 15%;
                }
                .footer {
                  position: fixed;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  padding-right:20px;
                  height: 100px;
                  background-color: white;
                  font-size: 14.63px !important;
                  color: #828282;
                  text-align: right;
                  font-weight: bold;
                }
                .
                .colum2Tittle{
                  text-align: center;
                  font-weight: bold;
                  text-transform: uppercase;
                  width: 40%;
                }
                .negrilla{
                    font-weight: bold;
                    padding-right: 3px;
                    padding-left: 10px;
                }
                .logo{
                  vertical-align: middle;
                  text-align: center;
                }
            
                .logo span {
                  display: block;
                  text-align: center;
                  font-weight: bold;
                  font-size: 12.40px !important;
                  color: green;
                  padding-top: 2px;
                  padding-bottom: 2px;
                  text-transform: uppercase;
                }
                .logo img{
                  width: 68px;
                  padding-bottom: 1px;
                  padding-top: 1px;
                }
                .colum2Tittle{
                    text-align: center;
                    font-weight: bold;
                    text-transform: uppercase;
                    width: 40%;
                  }
                  .colum2Body{
                    text-align: center;
                  }
                /* Establecer el formato para la primera página */
                @page :first {
                  .header {
                    display: block
                  }
                }
                /* Establecer el formato para las páginas siguientes */
                @page :left {
                  .header {
                    display: fixed;
                  }
                }
                .more-content {
                  page-break-before: always;
                }
              }
            </style>
          </head>
          <body>
            <div class="headerct">
              ${headerContent}
            </div>
            <div class="content">
              ${bodyContent}
            </div>
            <div class="footer">
              ${footerContent}
            </div>
            <div style="padding-top: 20%;" class="more-content">
              ${moreContent}
            </div>
          </body>
        </html>
      `);

  // Reemplaza con la ruta y nombre de tu archivo

  // Obtener información del archivo

  Files.find({ idObjeto: req.body.quotes.code }, async function (err, doc) {
    if (err) {
      console.log("error generate while found File in BD");
    } else {
      let nameQuoteModified;
      if(doc.length===0){
        nameQuoteModified = '';
      }else{
        nameQuoteModified = "-RV" + doc.length;
      }
      
      let quoteCode = req.body.quotes.code;
      await page.pdf({
        path: `public/storage/archivos/Quotes/${quoteCode}/${quoteCode}${nameQuoteModified}.pdf`,
        format: "A4",
        printBackground: true,
      });
      await browser.close();

      setTimeout(() => {
        SaveQuoteBD(req.body.quotes, nameQuoteModified)
          .then((response) => {
            const { estado, docBD } = response;
            // console.log("files relacionados:", req.body.quotes.files);
            // console.log("doc deelve:", docBD);
            let myDateCO = new Date();
            let listFilesPDF = [];
            listFilesPDF.push(...req.body.quotes.files);
            listFilesPDF.push({
              rute: docBD.path,
              name: docBD.name,
              creationDate: myDateCO.toLocaleDateString("es-CO"),
              timeCreated: myDateCO.toLocaleTimeString("es-CO"),
              clientName: req.body.quotes.client.name,
            });
            // console.log(listFilesPDF);
            Quotes.findOneAndUpdate(
              { code: docBD.idObjeto },
              {
                $set: {
                  files: listFilesPDF,
                },
              }
            ).exec(function (err, result) {
              try {
                if (err) {
                  console.log("No actualizo QUote con archivos", err);
                } else {
                  console.log("se actualizo los archivos de la Cotizacón");
                }
              } catch (error) {
                console.log("Error generate: guardar files cotizacion", error);
              }
            });
            res.json({
              success: true,
              status: 200,
              message: "Update PDF Quote successfull",
              doc: docBD,
            });
          })
          .catch((error) => {
            res.json({
              success: false,
              status: 500,
              message: "Error inesperado",
            });
            console.error("Error:", error);
            // Manejar el error aquí
          });
      }, 300);
    }
  });
};

/***Delete file Quotes*** */
module.exports.deleteFileQuotes = function (req, res) {
  

  if(req.body.quote.files.length!==0){
    let pathssave = [];
    pathssave.push(...req.body.quote.files);
  
    let pathDirToDelete = req.body.quote.files[0].rute.split("/");
    pathDirToDelete.pop();
    let pathToDeleteAfter = pathDirToDelete.join("/");
  
    //remueve todos los archivos dentro de la carpeta
    for (let index = 0; index < pathssave.length; index++) {
      const element = pathssave[index].rute;
      console.log("ruta almacenada en la cotizacion", element);
      fsPromise
        .unlink(element)
        .then(() => {
          console.info("File removed path: " + element);
        })
        .catch((err) => {
          console.info("Something wrong happened removing the file " + err);
        });
    }
    //elimina el directorio para evitar ocupar espacio en el disco
    setTimeout(() => {
      fs.rmdir(pathToDeleteAfter, function (err, succes) {
        if (err) {
          console.log("ocurrio un error", err);
        }
        console.log("Eliminacion de carpeta exitosa");
      });
    }, 200);
    Files.deleteMany({ idObjeto: req.body.quote.code }, (error, doc) => {
      if (error) {
        console.log("Error al eliminar los documentos:", error);
      } else {
        console.log(`Se eliminaron ${doc.deletedCount} documentos.`);
        CodesQuote.findOneAndRemove({ code: req.body.quote.code }).exec(function (
          err,
          doc
        ) {
          if (err) {
            console.log("Ocurrio algo eliminando el codigo", err);
          } else {
            console.log("Se elimino el codigo ingresado");
          }
        });
  
        res.send({
          success: true,
          message: "Operación exitosa",
          doc,
        });
      }
    });
  }
  
};

module.exports.deleteOneFilePDF = function (req, res) {
  let filter = req.params.id.split("-");
  let code = `${filter[0]}-${filter[1]}`;
  Files.findOneAndRemove({ name: req.params.id }, function (err, doc) {
    if (err) {
      console.info("error update archivo: " + err);
      res.json({
        message: "error",
        err,
      });
    } else {
      fsPromise
        .unlink(req.query.path)
        .then(() => {
          console.log("File removed path : " + req.query.path);
        })
        .catch((err) => {
          console.info("Something wrong happened removing the file " + err);
        });
      Quotes.find({ code: code }).exec(function (err, resolve) {
        if (err) {
          console.log("se genero un erro buscando la cotizacion");
        } else {
          let listFiles = resolve[0].files;
          let filesValidates = [];
          listFiles.forEach((element) => {
            if (element.name !== req.params.id) {
              filesValidates.push(element);
            }
          });
          console.log(filesValidates);
          Quotes.findOneAndUpdate(
            { code: code },
            { $set: { files: filesValidates } },
            function (err, doc) {
              if (err) {
                console.log("no cambio archivos de la cotizaicon");
              } else {
                console.log("actualizo los archivos de la cotizacion");
                res.send({
                        success: true,
                        message: "Operation Successfull",
                        doc,
                      });
              }
            }
          );
        }
      });
    }
  });

  // let pathSuccess=++++;
  // let pathSuccess = `public/storage/archivos/Tools/${folderD[4]}`;
  console.log(req.query.path);
  console.log(req.params.id);
  // Files.findOneAndRemove({ idObjeto: req.params.id }, function (err, doc) {
  //   if (err) {
  //     console.info("error update archivo: " + err);
  //     res.json({
  //       message: "error",
  //       err,
  //     });
  //   } else {
  //     /**Eliminacion del archivo anterior y elimina folder*/
  //     fsPromise
  //       .unlink(req.query.path)
  //       .then(() => {
  //         console.info("File removed path: " + req.query.path);
  //         fs.rmdir(pathSuccess, function (err, succes) {
  //           if (err) {
  //             console.log("ocurrio un error");
  //           }
  //           console.log("Eliminacion de carpeta exitosa");
  //         });
  //       })
  //       .catch((err) => {
  //         console.info("Something wrong happened removing the file " + err);
  //       });
  //     Codes.findOneAndRemove({ code: req.params.id }).exec(function (err, doc) {
  //       if (err) {
  //         console.log("Ocurrio algo eliminando el codigo", err);
  //       } else {
  //         console.log("Se elimino el codigo ingresado");
  //       }
  //     });
  //     res.send({
  //       success: true,
  //       message: "Operación exitosa",
  //       doc,
  //     });
  //   }
  // });
};

//Auxiliar fuction

function SaveQuoteBD(quote, pathUpdate) {
  let tipoMIME = mime.lookup(
    `public/storage/archivos/Quotes/${quote.code}/${quote.code}${pathUpdate}.pdf`
  );
  let filePath = `public/storage/archivos/Quotes/${quote.code}/${quote.code}${pathUpdate}.pdf`;

  const basePath = "public/storage/archivos/Quotes";
  const filename = `${quote.code}${pathUpdate}.pdf`;
  const middle = `${quote.code}${pathUpdate}`;

  const file_path = path.join(basePath, quote.code, filename);

  return new Promise((resolve, reject) => {
    fs.stat(file_path, (err, stats) => {
      if (err) {
        console.error("Error al obtener la información del archivo:", err);
        reject(err);
        return;
      }
      if (stats) {
        let fileSizeInBytes = stats.size;
        let fileURL = `${filePath}`;
        let fileExtension = path.extname(filePath).substring(1);
        let fileName = path.basename(filePath);
        let originalFileName = path.basename(filePath);
        let fileName2 = path.basename(filePath, path.extname(filePath));

        let dataFile = {
          name: fileName2,
          idObjeto: quote.code,
          type: tipoMIME,
          size: fileSizeInBytes,
          path: fileURL,
          url: fileURL,
          ext: fileExtension,
          dir: `Quotes/${quote.code}${pathUpdate}`,
          filename: fileName,
          originalFilename: originalFileName,
        };

        let archivo = new Files(dataFile);
        archivo.save(function (err, docBD) {
          if (err) {
            console.log("Se generó un error al guardar la quote", err);
            resolve({ estado: false, docBD: null });
          } else {
            console.log("El archivo con código fue agregado exitosamente");
            resolve({ estado: true, docBD });
          }
        });
      }
    });
  });
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}-${month}-${year}`;
}

function formatDateString(date) {
  const opciones = { day: "numeric", month: "long", year: "numeric" };
  const fechaFormateada = date.toLocaleDateString("es-ES", opciones);
  return fechaFormateada;
}

function formatDecimalCOP(value){
  var COPObj = {style: "currency",currency: "COP", maximumFractionDigits: 0}
  return value.toLocaleString("es-CO", COPObj);
}
