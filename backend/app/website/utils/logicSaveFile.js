var fs = require("fs");
var saveImagesB64 = require('../utils/saveImages');

function saveDocumentoLogic(base64, nombreArchivo, carpetaPersona, rutaGuardado) {
    return new Promise(async function (resolve) {
        if (!fs.existsSync(`${rutaGuardado}${carpetaPersona}`)) {
            const resCreateDirectory = await createDirectory(`${rutaGuardado}${carpetaPersona}`);
            if (resCreateDirectory.success === 1) {
                try {
                    const url = `${rutaGuardado}${carpetaPersona}\\\\${nombreArchivo}`;
                    const resSave = await saveImagesB64.saveImage(base64.split(';base64,').pop(), url);
                    if (resSave.success) {
                        resolve({ success: 1 })
                    } else {
                        resolve({ success: 0, msg: 'Error al guardar el documento' })
                    };
                } catch (error) {
                    resolve({ success: 0, msg: 'Error al intentar guardar el documento.' })
                };
            } else {
                resolve({ success: 0, msg: 'Error al crear la carpeta' })
            };
        } else {
            try {
                const url = `${rutaGuardado}${carpetaPersona}\\\\${nombreArchivo}`;
                const resSave = await saveImagesB64.saveImage(base64.split(';base64,').pop(), url);
                if (resSave.success) {
                    resolve({ success: 1 })
                } else {
                    resolve({ success: 0, msg: 'Error al guardar el documento' })
                };
            } catch (error) {
                resolve({ success: 0, msg: 'Error al intentar guardar el documento.' })
            };
        };
    });
};

createDirectory = ruta => {
    return new Promise(function (resolve) {
        try {
            fs.mkdirSync(ruta);

            setTimeout(() => {
                resolve({ success: 1 })
            }, 1000);
        } catch (e) {
            resolve({ success: 0, msg: 'Error al crear la carpeta' })
        };
    });
};

module.exports = { saveDocumentoLogic };