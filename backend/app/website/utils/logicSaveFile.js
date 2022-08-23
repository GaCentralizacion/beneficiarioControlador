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
                        resolve({ success: 1 });
                    } else {
                        resolve({ success: 0, msg: 'Error al guardar el documento' });
                    };
                } catch (error) {
                    resolve({ success: 0, msg: 'Error al intentar guardar el documento.' });
                };
            } else {
                resolve({ success: 0, msg: 'Error al crear la carpeta' });
            };
        } else {
            try {
                const url = `${rutaGuardado}${carpetaPersona}\\\\${nombreArchivo}`;
                const resSave = await saveImagesB64.saveImage(base64.split(';base64,').pop(), url);
                if (resSave.success) {
                    resolve({ success: 1 });
                } else {
                    resolve({ success: 0, msg: 'Error al guardar el documento' });
                };
            } catch (error) {
                resolve({ success: 0, msg: 'Error al intentar guardar el documento.' });
            };
        };
    });
};

function updateLogicDocumento(base64, nombreArchivo, carpetaPersona, rutaGuardado, archivoRespaldo, rutaRespaldo) {
    return new Promise(async function (resolve) {
        if (fs.existsSync(`${rutaGuardado}${carpetaPersona}\\\\${nombreArchivo}`)) {
            if (!fs.existsSync(`${rutaRespaldo}`)) {
                const resCreateDirectory = await createDirectory(`${rutaRespaldo}`);
                if (resCreateDirectory.success === 1) {
                    try {
                        const resCopyDirectory = await copyDirectory(`${rutaGuardado}${carpetaPersona}\\\\${nombreArchivo}`, `${rutaRespaldo}\\\\${archivoRespaldo}`);
                        if (resCopyDirectory.success === 1) {
                            const url = `${rutaGuardado}${carpetaPersona}\\\\${nombreArchivo}`;
                            const resSave = await saveImagesB64.saveImage(base64.split(';base64,').pop(), url);
                            if (resSave.success) {
                                resolve({ success: 1 });
                            } else {
                                resolve({ success: 0, msg: 'Error al actualizar el documento' });
                            };
                        } else {
                            resolve({ success: 0, msg: 'Error al intentar copiar el documento.' });
                        };
                    } catch (error) {
                        resolve({ success: 0, msg: 'Error al intentar copiar el documento.' });
                    };
                } else {
                    resolve({ success: 0, msg: 'Error al crear la carpeta para el copiar el archivo' });
                };
            } else {
                try {
                    const resCopyDirectory = await copyDirectory(`${rutaGuardado}${carpetaPersona}\\\\${nombreArchivo}`, `${rutaRespaldo}\\\\${archivoRespaldo}`);
                    if (resCopyDirectory.success === 1) {
                        const url = `${rutaGuardado}${carpetaPersona}\\\\${nombreArchivo}`;
                        const resSave = await saveImagesB64.saveImage(base64.split(';base64,').pop(), url);
                        if (resSave.success) {
                            resolve({ success: 1 });
                        } else {
                            resolve({ success: 0, msg: 'Error al actualizar el documento' });
                        };
                    } else {
                        resolve({ success: 0, msg: 'Error al intentar copiar el documento.' });
                    };
                } catch (error) {
                    resolve({ success: 0, msg: 'Error al intentar copiar el documento.' });
                };
            };
        } else {
            resolve({ success: 0, msg: 'No se encontro el archivo a actualizar en el servidor.' });
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

copyDirectory = (oldRuta, newRuta) => {
    return new Promise(function (resolve) {
        try {
            fs.renameSync(oldRuta, newRuta);

            setTimeout(() => {
                resolve({ success: 1 })
            }, 1000);
        } catch (e) {
            resolve({ success: 0, msg: 'Error al copiar el archivo' })
        };
    });
};

module.exports = { saveDocumentoLogic, updateLogicDocumento };