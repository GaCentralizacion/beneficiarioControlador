var suscripcionesView = require('../views/referencia'),
    suscripcionesModel = require('../models/dataAccess');

var suscripciones = function (conf) {
    this.conf = conf || {};

    this.view = new suscripcionesView();
    this.model = new suscripcionesModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


suscripciones.prototype.post_selAcciones = function (req, res, next) {
    var self = this;

    const { Opcion, IdPersona, Tipo, Participacion } = req.body;

    var params = [
        { name: 'Opcion', value: Opcion, type: self.model.types.INT },
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT },
        { name: 'Tipo', value: Tipo, type: self.model.types.INT },
        { name: 'Participacion', value: Participacion, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Sel_AccionesTransaccion]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

suscripciones.prototype.post_selAllTransacciones = function (req, res, next) {
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

suscripciones.prototype.post_insSuscripciones = function (req, res, next) {
    var self = this;

    const {
        Usuario,
        IdPersona,
        IdPersonaSubscripcion,
        IdConcepto,
        IdPersonaDestino,
        Serie,
        Cantidad,
        FechaAdquisicion,
        Observaciones,
        PrecioUnitarioVenta,
        ImporteVenta,
        Dictamen
    } = req.body;

    var params = [
        { name: 'Usuario', value: Usuario, type: self.model.types.INT },
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT },
        { name: 'IdPersonaSubscripcion', value: IdPersonaSubscripcion, type: self.model.types.INT },
        { name: 'IdConcepto', value: IdConcepto, type: self.model.types.INT },
        { name: 'IdPersonaDestino', value: IdPersonaDestino, type: self.model.types.INT },
        { name: 'Serie', value: Serie, type: self.model.types.STRING },
        { name: 'Cantidad', value: Cantidad, type: self.model.types.INT },
        { name: 'FechaAdquisicion', value: FechaAdquisicion, type: self.model.types.STRING },
        { name: 'Observaciones', value: Observaciones, type: self.model.types.STRING },
        { name: 'PrecioUnitarioVenta', value: PrecioUnitarioVenta, type: self.model.types.DECIMAL },
        { name: 'ImporteVenta', value: ImporteVenta, type: self.model.types.DECIMAL },
        { name: 'Dictamen', value: Dictamen, type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('[dbo].[Ins_Subscripciones]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

suscripciones.prototype.post_selPagos = function (req, res, next) {
    var self = this;

    const { Opcion, IdPersona } = req.body;

    var params = [
        { name: 'Opcion', value: Opcion, type: self.model.types.INT },
        { name: 'IdPersona', value: IdPersona, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Sel_SuscripcionPago]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

suscripciones.prototype.post_insPagos = function (req, res, next) {
    var self = this;

    const {
        Usuario,
        IdSubscripcion,
        ImportePago,
        FechaPago
    } = req.body;

    var params = [
        { name: 'Usuario', value: Usuario, type: self.model.types.INT },
        { name: 'IdSubscripcion', value: IdSubscripcion, type: self.model.types.INT },
        { name: 'ImportePago', value: ImportePago, type: self.model.types.DECIMAL },
        { name: 'FechaPago', value: FechaPago, type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('[dbo].[Ins_SuscripcionPago]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = suscripciones;