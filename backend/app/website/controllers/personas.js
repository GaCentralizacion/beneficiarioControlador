var personasView = require('../views/referencia'),
    personasModel = require('../models/dataAccess');

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

    this.model.queryAllRecordSet('[operacion].[SEL_ALL_PERSONAS_SP]', [], function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.get_allCatalogosAddPersonas = function (req, res, next) {
    var self = this;

    this.model.queryAllRecordSet('[catalogos].[SEL_CATALOGOS_ADD_PERSONAS_SP]', [], function (error, result) {
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
        nombres_razon,
        apellidoPaterno,
        apellidoMaterno,
        alias,
        fechaNac_constitucion,
        idSexo,
        idPais,
        curp_registroPob,
        idPaisFiscal,
        idIdentificacion,
        datoIdentificacion,
        rfc_identificacion,
        idEstCivil,
        xmlContacto,
        xmlDomicilio } = req.body

    var params = [
        { name: 'idTipoPersona', value: idTipoPersona, type: self.model.types.INT },
        { name: 'idTipoMor', value: idTipoMor, type: self.model.types.INT },
        { name: 'esAccionista', value: esAccionista, type: self.model.types.INT },
        { name: 'nombres_razon', value: nombres_razon, type: self.model.types.STRING },
        { name: 'apellidoPaterno', value: apellidoPaterno, type: self.model.types.STRING },
        { name: 'apellidoMaterno', value: apellidoMaterno, type: self.model.types.STRING },
        { name: 'alias', value: alias, type: self.model.types.STRING },
        { name: 'fechaNac_constitucion', value: fechaNac_constitucion, type: self.model.types.STRING },
        { name: 'idSexo', value: idSexo, type: self.model.types.INT },
        { name: 'idPais', value: idPais, type: self.model.types.INT },
        { name: 'curp_registroPob', value: curp_registroPob, type: self.model.types.STRING },
        { name: 'idPaisFiscal', value: idPaisFiscal, type: self.model.types.INT },
        { name: 'idIdentificacion', value: idIdentificacion, type: self.model.types.INT },
        { name: 'datoIdentificacion', value: datoIdentificacion, type: self.model.types.STRING },
        { name: 'rfc_identificacion', value: rfc_identificacion, type: self.model.types.STRING },
        { name: 'idEstCivil', value: idEstCivil, type: self.model.types.INT },
        { name: 'xmlContacto', value: xmlContacto, type: self.model.types.XML },
        { name: 'xmlDomicilio', value: xmlDomicilio, type: self.model.types.XML },
    ];

    this.model.queryAllRecordSet('[operacion].[INS_PERSONA_SP]', params, function (error, result) {
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

personas.prototype.post_selPersona = function (req, res, next) {
    var self = this;

    const { idPersona } = req.body

    var params = [
        { name: 'idPersona', value: idPersona, type: self.model.types.INT },
    ];

    this.model.queryAllRecordSet('[operacion].[SEL_PERSONA_BY_ID_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

personas.prototype.post_updPersona = function (req, res, next) {
    var self = this;

    const {
        idPersona,
        idTipoPersona,
        idTipoMor,
        esAccionista,
        nombres_razon,
        apellidoPaterno,
        apellidoMaterno,
        alias,
        fechaNac_constitucion,
        idSexo,
        idPais,
        curp_registroPob,
        idPaisFiscal,
        idIdentificacion,
        datoIdentificacion,
        rfc_identificacion,
        idEstCivil,
        xmlContacto,
        xmlDomicilio } = req.body

    var params = [
        { name: 'idPersona', value: idPersona, type: self.model.types.INT },
        { name: 'idTipoPersona', value: idTipoPersona, type: self.model.types.INT },
        { name: 'idTipoMor', value: idTipoMor, type: self.model.types.INT },
        { name: 'esAccionista', value: esAccionista, type: self.model.types.INT },
        { name: 'nombres_razon', value: nombres_razon, type: self.model.types.STRING },
        { name: 'apellidoPaterno', value: apellidoPaterno, type: self.model.types.STRING },
        { name: 'apellidoMaterno', value: apellidoMaterno, type: self.model.types.STRING },
        { name: 'alias', value: alias, type: self.model.types.STRING },
        { name: 'fechaNac_constitucion', value: fechaNac_constitucion, type: self.model.types.STRING },
        { name: 'idSexo', value: idSexo, type: self.model.types.INT },
        { name: 'idPais', value: idPais, type: self.model.types.INT },
        { name: 'curp_registroPob', value: curp_registroPob, type: self.model.types.STRING },
        { name: 'idPaisFiscal', value: idPaisFiscal, type: self.model.types.INT },
        { name: 'idIdentificacion', value: idIdentificacion, type: self.model.types.INT },
        { name: 'datoIdentificacion', value: datoIdentificacion, type: self.model.types.STRING },
        { name: 'rfc_identificacion', value: rfc_identificacion, type: self.model.types.STRING },
        { name: 'idEstCivil', value: idEstCivil, type: self.model.types.INT },
        { name: 'xmlContacto', value: xmlContacto, type: self.model.types.XML },
        { name: 'xmlDomicilio', value: xmlDomicilio, type: self.model.types.XML },
    ];
    console.log()
    this.model.queryAllRecordSet('[operacion].[UPD_PERSONA_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = personas;