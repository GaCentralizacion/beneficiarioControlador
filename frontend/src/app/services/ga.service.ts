import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class GaService {
	headers: HttpHeaders;
	url: string;
	urlsparrow: string;
	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		this.url = environment.serviceUrl;
	}

	getService(ruta: string, headers?: HttpHeaders) {
		if (headers) { this.headers = headers; }
		return this.http.get(this.url + ruta, { headers: this.headers });
	}

	postService(ruta: string, body?: any, headers?: HttpHeaders) {
		if (headers) { this.headers = headers; }
		return this.http.post(this.url + ruta, body, { headers: this.headers });
	}

	putService(ruta: string, body?: any, headers?: HttpHeaders) {
		if (headers) { this.headers = headers; }
		return this.http.put(this.url + ruta, body, { headers: this.headers });
	}

	deleteService(ruta: string, data: any, headers?: HttpHeaders) {
		if (headers) { this.headers = headers; }
		return this.http.delete(this.url + ruta + '?' + data, { headers: this.headers });
	}

	postServiceBuffer(ruta: string, body?: any, headers?: any) {
		//console.log(this.urlsparrow + ruta);
		return this.http.post(this.urlsparrow + ruta, body, { responseType: "arraybuffer" });
	}
	postServiceSparrow(ruta: string, body?: any, headers?: HttpHeaders) {
		if (headers) { this.headers = headers; }
		return this.http.post(this.urlsparrow + ruta, body, { headers: this.headers });
	}
}