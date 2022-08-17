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

module.exports = subscripciones;