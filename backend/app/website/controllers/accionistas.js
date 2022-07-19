var accionistasView = require('../views/referencia'),
    accionistasModel = require('../models/dataAccess');

var cron = require('node-cron');
var confParams = require('../../../conf.json');

var accionistas = function (conf) {
    this.conf = conf || {};

    this.view = new accionistasView();
    this.model = new accionistasModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

/**
 * CRONES
 */

cron.schedule("32 19 * * *", async function () {
    console.log('ANTES')
    let res = await accionistas.pruebaCron();
    console.log('resultPromise', res[0].data);
});

accionistas.pruebaCron = () => {
    return new Promise(resolve => {
        var model = new accionistasModel({
            parameters: confParams
        });
        setTimeout(() => {
            model.queryAllRecordSet('[SEL_ALL_USUARIOS_SP]', [], async (error, result) => {
                resolve([{ success: 1, data: result }])
            });
        }, 5000);

    });
};


accionistas.prototype.get_selAllAccionistas = function (req, res, next) {
    var self = this;
    var params = [];

    this.model.queryAllRecordSet('[SEL_ALL_USUARIOS_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

accionistas.prototype.get_selAccionistaByid = function (req, res, next) {
    var self = this;

    const { idUsuario } = req.query;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[SEL_USUARIO_BY_ID_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = accionistas;