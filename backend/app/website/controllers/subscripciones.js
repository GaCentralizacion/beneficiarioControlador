var subscripcionesView = require('../views/referencia'),
    subscripcionesModel = require('../models/dataAccess');

var subscripciones = function (conf) {
    this.conf = conf || {};

    this.view = new subscripcionesView();
    this.model = new subscripcionesModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


subscripciones.prototype.post_selAcciones = function (req, res, next) {
    var self = this;

    const { Opcion, IdPersona } = req.body;

    var params = [
        { name: 'Opcion', value: Opcion, type: self.model.types.INT },
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Sel_AccionesTransaccion]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

subscripciones.prototype.post_selAllTransacciones = function (req, res, next) {
    var self = this;

    const {
        Opcion,
        IdPersona,
        IdPersonaSubscripcion,
        IdConcepto
    } = req.body;

    var params = [
        { name: 'Opcion', value: Opcion, type: self.model.types.INT },
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT },
        { name: 'IdPersonaSubscripcion', value: IdPersonaSubscripcion, type: self.model.types.INT },
        { name: 'IdConcepto', value: IdConcepto, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Sel_Cat_RegistroSubs]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

subscripciones.prototype.post_insSubscripciones = function (req, res, next) {
    var self = this;

    const {
        Usuario,
        IdPersona,
        IdPersonaSubscripcion,
        IdConcepto,
        IdPersonaDestino,
        Serie,
        Cantidad,
        FechaAduisicion,
        Observaciones,
        PrecioUnitarioVenta,
        ImporteVenta
    } = req.body;

    var params = [
        { name: 'Usuario', value: Usuario, type: self.model.types.INT },
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT },
        { name: 'IdPersonaSubscripcion', value: IdPersonaSubscripcion, type: self.model.types.INT },
        { name: 'IdConcepto', value: IdConcepto, type: self.model.types.INT },
        { name: 'IdPersonaDestino', value: IdPersonaDestino, type: self.model.types.INT },
        { name: 'Serie', value: Serie, type: self.model.types.STRING },
        { name: 'Cantidad', value: Cantidad, type: self.model.types.INT },
        { name: 'FechaAduisicion', value: FechaAduisicion, type: self.model.types.STRING },
        { name: 'Observaciones', value: Observaciones, type: self.model.types.STRING },
        { name: 'PrecioUnitarioVenta', value: PrecioUnitarioVenta, type: self.model.types.DECIMAL },
        { name: 'ImporteVenta', value: ImporteVenta, type: self.model.types.DECIMAL }
    ];

    this.model.queryAllRecordSet('[dbo].[Ins_Subscripciones]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = subscripciones;