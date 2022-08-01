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
        { name: 'UserName', value: usuario, type: self.model.types.STRING },
        { name: 'Password', value: pass, type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('[dbo].[Sis_Login]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

login.prototype.post_menuApp = function (req, res, next) {
    var self = this;

    const { idRol } = req.body;
    var params = [
        { name: 'idRol', value: idRol, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[Sel_MenuApp]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = login;