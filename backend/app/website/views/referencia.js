var Referencia = function (conf) {
	conf = conf || {};
}

function logError(err, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write("Error: " + err);
	res.end("");
}

Referencia.prototype.expositor = function (res, object) {
	//Estándar de implementación de errores
	if (object.error) { logError(object.error, res); return; }

	if (object.result) {
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS, HEAD'
		});
		res.write(JSON.stringify(object.result));
		res.end("");
	}
}


module.exports = Referencia; 
