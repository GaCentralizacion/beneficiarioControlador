var sql = require('mssql'),
    config = {};

//configuración genérica para modelo de acceso a datos
var DataAccess = function (config) {
    //Inicializamos el objeto config
    this.config = config || {};
    //Inicializamos la conexión
    connectionString = {
        user: this.config.parameters.SQL_user,
        password: this.config.parameters.SQL_password,
        server: this.config.parameters.SQL_server, // You can use 'localhost\\instance' to connect to named instance
        database: this.config.parameters.SQL_database,
        connectionTimeout: this.config.parameters.SQL_connectionTimeout
    };
    this.types = {
        INT: sql.Int,
        DECIMAL: sql.Decimal(18, 5),
        STRING: sql.VarChar(8000),
        DATE: sql.DateTime,
        BIT: sql.bit,
        XML: sql.Xml
    }
    this.connection = new sql.Connection(connectionString);
};

//método genérico para acciones get
DataAccess.prototype.query = function (stored, params, callback) {
    //console.log("query");
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure
        var request = new sql.Request(self);
        // Add inputs
        if (params.length > 0) {
            params.forEach(function (param) {
                request.input(param.name, param.type, param.value);
            });
        }

        request.execute(stored)
            .then(function (recordsets) {
                callback(null, recordsets[0]);
            }).catch(function (err) {
                callback(err);
                //console.log('Error al realizar la operacion, mensaje: ' + err);
            });
    });
};

//método genérico para acciones get
DataAccess.prototype.queryAllRecordSet = function (stored, params, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure
        var request = new sql.Request(self);
        // Add inputs
        if (params.length > 0) {
            params.forEach(function (param) {
                request.input(param.name, param.type, param.value);
            });
        }
        request.execute(stored)
            .then(function (recordsets) {
                callback(null, recordsets);
            }).catch(function (err) {
                callback(err);
            });
    });
};

//método genérico para acciones post
DataAccess.prototype.post = function (stored, params, callback) {
    var self = this.connection;
    this.connection.connect(function (err) {
        // Stored Procedure
        var request = new sql.Request(self);

        if (params.length > 0) {
            params.forEach(function (param) {
                request.input(param.name, param.type, param.value);
            });
        }
        request.execute(stored, function (err, recordsets, returnValue) {
            if (recordsets != null) {
                callback(err, recordsets[0]);
            } else {
                //console.log('Error al realizacion la insercción: ' + params + ' mensaje: ' + err);
            }
        });
    });
};

//exportación del modelo
module.exports = DataAccess;
