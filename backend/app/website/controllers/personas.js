var personasView = require('../views/referencia'),
    personasModel = require('../models/dataAccess');

var logicSave = require('../utils/logicSaveFile');
var fs = require("fs");

var personas = function (conf) {
    this.conf = conf || {};

    this.view = new personasView();
    this.model = new personasModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


personas.prototype.get_allPersonas = function (req, res, next) {
    var self = this;

    const { opcion, usuario } = req.query;

    var params = [
        { name: 'Opcion', value: opcion, type: self.model.types.INT },
        { name: 'Usuario', value: usuario, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Sel_Persona]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.get_allCatalogosAddPersonas = function (req, res, next) {
    var self = this;

    this.model.queryAllRecordSet('[dbo].[Sel_Catalogos]', [], function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_allFormOptions = function (req, res, next) {
    var self = this;

    const { IdMenuApp, IdTipoPer } = req.body;

    var params = [
        { name: 'IdMenuApp', value: IdMenuApp, type: self.model.types.INT },
        { name: 'IdTipoPer', value: IdTipoPer, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('Sel_CamposObligatorios', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_insPersona = function (req, res, next) {
    var self = this;

    const { idTipoPersona,
        idTipoMor,
        esAccionista,
        rfc_identificacion,
        nombres_razon,
        apellidoPaterno,
        apellidoMaterno,
        alias,
        idPais,
        fechaNac_constitucion,
        idSexo,
        curp_registroPob,
        idIdentificacion,
        datoIdentificacion,
        idEstCivil,
        idUsuario,
        IdRegimenFiscal,
        AllPaises,
        xmlContacto,
        xmlDomicilio } = req.body

    if (idTipoPersona === 1) {
        var params = [
            { name: 'IdTipoPer', value: idTipoPersona, type: self.model.types.INT },
            { name: 'EsAccionista', value: esAccionista, type: self.model.types.INT },
            { name: 'RFC', value: rfc_identificacion, type: self.model.types.STRING },
            { name: 'Nombre_RazonSocial', value: nombres_razon, type: self.model.types.STRING },
            { name: 'APaterno', value: apellidoPaterno, type: self.model.types.STRING },
            { name: 'AMaterno', value: apellidoMaterno, type: self.model.types.STRING },
            { name: 'Alias', value: alias, type: self.model.types.STRING },
            { name: 'IdPais', value: idPais, type: self.model.types.INT },
            { name: 'Fecha_nacimiento_Constitucion', value: fechaNac_constitucion, type: self.model.types.STRING },
            { name: 'IdTipoSexo', value: idSexo, type: self.model.types.INT },
            { name: 'Registro_de_poblacion', value: curp_registroPob, type: self.model.types.STRING },
            { name: 'IdTipoIdentificacion', value: idIdentificacion, type: self.model.types.INT },
            { name: 'Identificiacion', value: datoIdentificacion, type: self.model.types.STRING },
            { name: 'IdEstadoCivil', value: idEstCivil, type: self.model.types.INT },
            { name: 'Usuario', value: idUsuario, type: self.model.types.INT },
            { name: 'AllPaises', value: AllPaises, type: self.model.types.STRING },
            { name: 'xmlContacto', value: xmlContacto, type: self.model.types.XML },
            { name: 'xmlDomicilio', value: xmlDomicilio, type: self.model.types.XML }
        ];
    } else {
        var params = [
            { name: 'IdTipoPer', value: idTipoPersona, type: self.model.types.INT },
            { name: 'IdTipoMoral', value: idTipoMor, type: self.model.types.INT },
            { name: 'EsAccionista', value: esAccionista, type: self.model.types.INT },
            { name: 'RFC', value: rfc_identificacion, type: self.model.types.STRING },
            { name: 'Nombre_RazonSocial', value: nombres_razon, type: self.model.types.STRING },
            { name: 'Alias', value: alias, type: self.model.types.STRING },
            { name: 'IdPais', value: idPais, type: self.model.types.INT },
            { name: 'Fecha_nacimiento_Constitucion', value: fechaNac_constitucion, type: self.model.types.STRING },
            { name: 'Usuario', value: idUsuario, type: self.model.types.INT },
            { name: 'IdRegimenFiscal', value: IdRegimenFiscal, type: self.model.types.INT },
            { name: 'AllPaises', value: AllPaises, type: self.model.types.STRING },
            { name: 'xmlContacto', value: xmlContacto, type: self.model.types.XML },
            { name: 'xmlDomicilio', value: xmlDomicilio, type: self.model.types.XML }
        ];
    };

    this.model.queryAllRecordSet('[dbo].[Ins_Persona]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_selPersona = function (req, res, next) {
    var self = this;

    const { Opcion,
        Usuario,
        IdPersona } = req.body

    var params = [
        { name: 'Opcion', value: Opcion, type: self.model.types.INT },
        { name: 'Usuario', value: Usuario, type: self.model.types.INT },
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Sel_Persona]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_delPersona = function (req, res, next) {
    var self = this;

    const { idPersona } = req.body

    var params = [
        { name: 'idPersona', value: idPersona, type: self.model.types.INT },
    ];

    this.model.queryAllRecordSet('[operacion].[DEL_PERSONA_BY_ID_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_updPersona = function (req, res, next) {
    var self = this;

    const {
        IdPersona,
        IdTipoPer,
        IdTipoMoral,
        EsAccionista,
        RFC,
        Nombre_RazonSocial,
        APaterno,
        AMaterno,
        Alias,
        IdPais,
        Fecha_nacimiento_Constitucion,
        IdTipoSexo,
        Registro_de_poblacion,
        IdTipoIdentificacion,
        Identificiacion,
        IdEstadoCivil,
        idUsuario,
        IdRegimenFiscal,
        AllPaises,
        XMLContacto,
        XMLDomicilio
    } = req.body;

    var params = [
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT },
        { name: 'IdTipoPer', value: IdTipoPer, type: self.model.types.INT },
        { name: 'IdTipoMoral', value: IdTipoMoral, type: self.model.types.INT },
        { name: 'EsAccionista', value: EsAccionista, type: self.model.types.INT },
        { name: 'RFC', value: RFC, type: self.model.types.STRING },
        { name: 'Nombre_RazonSocial', value: Nombre_RazonSocial, type: self.model.types.STRING },
        { name: 'APaterno', value: APaterno, type: self.model.types.STRING },
        { name: 'AMaterno', value: AMaterno, type: self.model.types.STRING },
        { name: 'Alias', value: Alias, type: self.model.types.STRING },
        { name: 'IdPais', value: IdPais, type: self.model.types.INT },
        { name: 'Fecha_nacimiento_Constitucion', value: Fecha_nacimiento_Constitucion, type: self.model.types.STRING },
        { name: 'IdTipoSexo', value: IdTipoSexo, type: self.model.types.STRING },
        { name: 'Registro_de_poblacion', value: Registro_de_poblacion, type: self.model.types.STRING },
        { name: 'IdTipoIdentificacion', value: IdTipoIdentificacion, type: self.model.types.INT },
        { name: 'Identificiacion', value: Identificiacion, type: self.model.types.STRING },
        { name: 'IdEstadoCivil', value: IdEstadoCivil, type: self.model.types.INT },
        { name: 'Usuario', value: idUsuario, type: self.model.types.INT },
        { name: 'IdRegimenFiscal', value: IdRegimenFiscal, type: self.model.types.INT },
        { name: 'AllPaises', value: AllPaises, type: self.model.types.STRING },
        { name: 'XMLContacto', value: XMLContacto, type: self.model.types.XML },
        { name: 'XMLDomicilio', value: XMLDomicilio, type: self.model.types.XML },
    ];

    this.model.queryAllRecordSet('[dbo].[Upd_Persona]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_selDataSepoMex = function (req, res, next) {
    var self = this;

    const { CodigoPostal } = req.body

    var params = [
        { name: 'CodigoPostal', value: CodigoPostal, type: self.model.types.STRING },
    ];

    this.model.queryAllRecordSet('[dbo].[Sel_Sepomex]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_selAllRelacionesFamiliares = function (req, res, next) {
    var self = this;

    const { Opcion,
        IdPersona } = req.body

    var params = [
        { name: 'Opcion', value: Opcion, type: self.model.types.INT },
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT },
    ];

    this.model.queryAllRecordSet('[dbo].[Sel_PersonaRelFamiliar]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_insRelacionesFamiliares = function (req, res, next) {
    var self = this;

    const {
        Usuario,
        IdPersona,
        IdPersonaRelacion,
        IdRelFamiliar,
        IdTipoPatrimonial
    } = req.body

    var params = [
        { name: 'Usuario', value: Usuario, type: self.model.types.INT },
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT },
        { name: 'IdPersonaRelacion', value: IdPersonaRelacion, type: self.model.types.INT },
        { name: 'IdRelFamiliar', value: IdRelFamiliar, type: self.model.types.INT },
        { name: 'IdTipoPatrimonial', value: IdTipoPatrimonial, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Ins_PersonaRelFamiliar]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_delRelacionesFamiliares = function (req, res, next) {
    var self = this;

    const {
        Usuario,
        IdPersonaRelFam
    } = req.body

    var params = [
        { name: 'Usuario', value: Usuario, type: self.model.types.INT },
        { name: 'IdPersonaRelFam', value: IdPersonaRelFam, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Upd_PersonaRelFamiliar]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_selDocumentosExpediente = function (req, res, next) {
    var self = this;

    const {
        IdPersona
    } = req.body

    var params = [
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Sel_DocumentosPersona]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_saveDocumentoExpediente = async function (req, res, next) {
    var self = this;

    const {
        b64File,
        IdDocumento,
        nombreArchivo,
        carpetaPersona,
        idPersona,
        rutaGuardado,
        fechaDocumento,
        idUsuario,
        CarpetaHeredado
    } = req.body;

    const resLogic = await logicSave.saveDocumentoLogic(b64File, nombreArchivo, carpetaPersona, rutaGuardado);

    if (resLogic.success === 1) {
        if (fs.existsSync(`${rutaGuardado}${carpetaPersona}\\\\${nombreArchivo}`)) {
            if (CarpetaHeredado === '') {
                var params = [
                    { name: 'Usuario', value: idUsuario, type: self.model.types.INT },
                    { name: 'IdPersona', value: idPersona, type: self.model.types.INT },
                    { name: 'IdDocumento', value: IdDocumento, type: self.model.types.INT },
                    { name: 'FechaDocumento', value: fechaDocumento, type: self.model.types.STRING }
                ];

                this.model.queryAllRecordSet('[dbo].[Ins_DocumentosPersona]', params, function (error, result) {
                    self.view.expositor(res, {
                        error: error,
                        result: result
                    });
                });
            } else {
                const resLogicHeredado = await logicSave.saveDocumentoLogic(b64File, nombreArchivo, CarpetaHeredado, rutaGuardado);
                if (resLogicHeredado.success === 1) {
                    if (fs.existsSync(`${rutaGuardado}${CarpetaHeredado}\\\\${nombreArchivo}`)) {
                        var params = [
                            { name: 'Usuario', value: idUsuario, type: self.model.types.INT },
                            { name: 'IdPersona', value: idPersona, type: self.model.types.INT },
                            { name: 'IdDocumento', value: IdDocumento, type: self.model.types.INT },
                            { name: 'FechaDocumento', value: fechaDocumento, type: self.model.types.STRING }
                        ];

                        this.model.queryAllRecordSet('[dbo].[Ins_DocumentosPersona]', params, function (error, result) {
                            self.view.expositor(res, {
                                error: error,
                                result: result
                            });
                        });
                    } else {
                        self.view.expositor(res, {
                            result: [[{ Codigo: -1, Mensaje: 'No se guardo el documento heredado fisicamente.' }]]
                        });
                    }
                } else {
                    self.view.expositor(res, {
                        result: [[{ Codigo: -1, Mensaje: 'Error al guardar el documento heredado fisicamente.' }]]
                    });
                };
            };
        } else {
            self.view.expositor(res, {
                result: [[{ Codigo: -1, Mensaje: 'No se guardo el documento fisicamente.' }]]
            });
        };
    } else {
        self.view.expositor(res, {
            result: [[{ Codigo: -1, Mensaje: 'Error al intentar guardar el documento.' }]]
        });
    };
};

personas.prototype.post_aprobarRechazarDocumento = function (req, res, next) {
    var self = this;

    const {
        Opcion,
        Usuario,
        IdExpPer,
        FechaDocumento,
        IdEstatusArchivo,
        Observacion
    } = req.body

    var params = [
        { name: 'Opcion', value: Opcion, type: self.model.types.INT },
        { name: 'Usuario', value: Usuario, type: self.model.types.INT },
        { name: 'IdExpPer', value: IdExpPer, type: self.model.types.INT },
        { name: 'FechaDocumento', value: FechaDocumento, type: self.model.types.STRING },
        { name: 'IdEstatusArchivo', value: IdEstatusArchivo, type: self.model.types.INT },
        { name: 'Observacion', value: Observacion, type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('[dbo].[Upd_DocumentosPersona]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_updateDocumento = async function (req, res, next) {
    var self = this;

    const {
        Opcion,
        Usuario,
        IdExpPer,
        FechaDocumento,
        IdEstatusArchivo,
        Observacion,
        nombreDocumento,
        nombreDocumentoRespaldo,
        carpeta,
        carpetaHeredado,
        idDocumento,
        idPersona,
        rutaGuardado,
        rutaRespaldo,
        b64File,
        RutaRespaldoHeredado
    } = req.body

    const logicSaveRes = await logicSave.updateLogicDocumento(b64File, nombreDocumento, carpeta, rutaGuardado, nombreDocumentoRespaldo, rutaRespaldo);
    if (logicSaveRes.success === 1) {
        if (fs.existsSync(`${rutaGuardado}${carpeta}\\\\${nombreDocumento}`)) {
            if (carpetaHeredado === '') {
                var params = [
                    { name: 'Opcion', value: Opcion, type: self.model.types.INT },
                    { name: 'Usuario', value: Usuario, type: self.model.types.INT },
                    { name: 'IdExpPer', value: IdExpPer, type: self.model.types.INT },
                    { name: 'FechaDocumento', value: FechaDocumento, type: self.model.types.STRING },
                    { name: 'IdEstatusArchivo', value: IdEstatusArchivo, type: self.model.types.INT },
                    { name: 'Observacion', value: Observacion, type: self.model.types.STRING }
                ];

                this.model.queryAllRecordSet('[dbo].[Upd_DocumentosPersona]', params, function (error, result) {
                    self.view.expositor(res, {
                        error: error,
                        result: result
                    });
                });
            } else {
                const logicSaveResHeredado = await logicSave.updateLogicDocumento(b64File, nombreDocumento, carpetaHeredado, rutaGuardado, nombreDocumentoRespaldo, RutaRespaldoHeredado);
                if (logicSaveResHeredado.success === 1) {
                    if (fs.existsSync(`${rutaGuardado}${carpetaHeredado}\\\\${nombreDocumento}`)) {
                        var params = [
                            { name: 'Opcion', value: Opcion, type: self.model.types.INT },
                            { name: 'Usuario', value: Usuario, type: self.model.types.INT },
                            { name: 'IdExpPer', value: IdExpPer, type: self.model.types.INT },
                            { name: 'FechaDocumento', value: FechaDocumento, type: self.model.types.STRING },
                            { name: 'IdEstatusArchivo', value: IdEstatusArchivo, type: self.model.types.INT },
                            { name: 'Observacion', value: Observacion, type: self.model.types.STRING }
                        ];

                        this.model.queryAllRecordSet('[dbo].[Upd_DocumentosPersona]', params, function (error, result) {
                            self.view.expositor(res, {
                                error: error,
                                result: result
                            });
                        });
                    } else {
                        self.view.expositor(res, {
                            result: [[{ Codigo: -1, Mensaje: 'Error no se guardo el archivo heredado' }]]
                        });
                    };
                } else {
                    self.view.expositor(res, {
                        result: [[{ Codigo: -1, Mensaje: 'Error al guardar el archivo heredado' }]]
                    });
                };
            };
        } else {
            self.view.expositor(res, {
                result: [[{ Codigo: -1, Mensaje: 'Error al guardar el archivo' }]]
            });
        };
    } else {
        self.view.expositor(res, {
            result: [[{ Codigo: -1, Mensaje: logicSaveRes.msg }]]
        });
    };
};

personas.prototype.post_insContactoPersona = function (req, res, next) {
    var self = this;

    const {
        IdPersona,
        IdTipoContacto,
        Dato,
        Predeterminado,
        Ext,
        PersonaContacto,
        Usuario
    } = req.body

    var params = [
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT },
        { name: 'IdTipoContacto', value: IdTipoContacto, type: self.model.types.INT },
        { name: 'Dato', value: Dato, type: self.model.types.STRING },
        { name: 'Predeterminado', value: Predeterminado, type: self.model.types.STRING },
        { name: 'Ext', value: Ext, type: self.model.types.STRING },
        { name: 'PersonaContacto', value: PersonaContacto, type: self.model.types.STRING },
        { name: 'Usuario', value: Usuario, type: self.model.types.INT },
    ];

    this.model.queryAllRecordSet('[dbo].[Ins_ContactoPersona]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_updContactoPersona = function (req, res, next) {
    var self = this;

    const {
        IdContacto,
        IdTipoContacto,
        Dato,
        Predeterminado,
        Ext,
        PersonaContacto,
        Usuario,
        Opcion
    } = req.body

    var params = [
        { name: 'IdContacto', value: IdContacto, type: self.model.types.INT },
        { name: 'IdTipoContacto', value: IdTipoContacto, type: self.model.types.INT },
        { name: 'Dato', value: Dato, type: self.model.types.STRING },
        { name: 'Predeterminado', value: Predeterminado, type: self.model.types.STRING },
        { name: 'Ext', value: Ext, type: self.model.types.STRING },
        { name: 'PersonaContacto', value: PersonaContacto, type: self.model.types.STRING },
        { name: 'Usuario', value: Usuario, type: self.model.types.INT },
        { name: 'Opcion', value: Opcion, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Upd_ContactoPersona]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = personas;