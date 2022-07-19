var loginView = require('../views/referencia'),
    loginModel = require('../models/dataAccess');

var login = function (conf) {
    this.conf = conf || {};

    this.view = new loginView();
    this.model = new loginModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


login.prototype.post_loginUser = function (req, res, next) {
    var self = this;

    const { usuario, pass } = req.body;
    var params = [
        { name: 'usuario', value: usuario, type: self.model.types.STRING },
        { name: 'pass', value: pass, type: self.model.types.STRING }
    ];
    console.log('loginUser en la back ga', params)
    this.model.queryAllRecordSet('[SEL_USUARIOS_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = login;