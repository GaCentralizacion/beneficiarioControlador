import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

/**
 * Obtenemos el Mensaje a mostrar
 */
export interface SendData {
	title: string;
	dataEmpresa: any;
}

@Component({
	selector: 'app-addAcciones',
	templateUrl: './addAcciones.component.html',
	styleUrls: ['./addAcciones.component.scss']
})
export class AddAccionesComponent implements OnInit {
	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataUsuario: any;
	dataEmpresa: any;
	emisionesForm: FormGroup;
	allConceptos: any;
	allMonedas: any;
	allSeries: any;
	today = new Date();

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<AddAccionesComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private gaService: GaService,
		private spinner: NgxSpinnerService
	) {
		this.titulo = data.title;
		this.dataEmpresa = data.dataEmpresa;
	};

	ngOnInit() {
		this.getEmisiones();
		this.emisionesForm = this._formBuilder.group({
			razonSocial: [this.dataEmpresa.RazonSocial, Validators.required],
			moneda: [0, Validators.min(1)],
			concepto: [0, Validators.min(1)],
			serie: ['', Validators.required],
			valorUnitario: [null, Validators.required],
			cantidad: [0, Validators.required],
			fechaEmision: ['', Validators.required]
		});
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
	};

	getEmisiones = () =>{
		this.spinner.show();
		const data ={
			IdPersona: this.dataEmpresa.IdPersona
		};

		this.gaService.postService('suscripciones/selEmisiones', data).subscribe(res=>{
			this.spinner.hide();
			if( res[1].length > 0 ){
				this.allConceptos = res[1];
			}else{
				Swal.fire({
					title: '¡Alto!',
					text: 'No se obtuvieron los conceptos',
					icon: 'warning',
					confirmButtonText: 'Cerrar'
				});
			};

			if( res[0].length > 0 ){
				this.allMonedas = res[0];
			}else{
				Swal.fire({
					title: '¡Alto!',
					text: 'No se obtuvieron los tipos de maneda',
					icon: 'warning',
					confirmButtonText: 'Cerrar'
				});
			};

			if( res[2].length > 0 ){
				this.allSeries = res[2];
			};
		}, (error: any) => {
			this.spinner.hide();
			Swal.fire({
				title: '¡Error!',
				text: 'Error 500, al guardar al obtener información',
				icon: 'error',
				confirmButtonText: 'Cerrar'
			});
		});
	};

	changeSerie = e =>{
		const valorUnitario = this.allSeries.filter(s => s.Serie === e);
		if( valorUnitario.length ){
			this.emisionesForm.controls.valorUnitario.setValue(valorUnitario[0].ValorUnitario);
		}else{
			this.emisionesForm.controls.valorUnitario.setValue(null);
		};
	};

	insertEmisiones = () =>{
		this.spinner.show();
		const data = {
			Usuario: this.dataUsuario.IdUsuario,
			IdPersona: this.dataEmpresa.IdPersona,
			IdTipoMoneda: this.emisionesForm.controls.moneda.value,
			IdConEmision: this.emisionesForm.controls.concepto.value,
			Serie: this.emisionesForm.controls.serie.value,
			ValorUnitario: this.emisionesForm.controls.valorUnitario.value,
			Cantidad: this.emisionesForm.controls.cantidad.value,
			FechaEmision: this.emisionesForm.controls.fechaEmision.value
		};

		this.gaService.postService('suscripciones/insEmisiones', data).subscribe(res=>{
			this.spinner.hide();
			if (res[0][0].Codigo < 0) {
				Swal.fire({
					title: '¡Alto!',
					text: res[0][0].Mensaje,
					icon: 'warning',
					confirmButtonText: 'Cerrar'
				});
			}else{
				Swal.fire({
					title: '¡Listo!',
					text: res[0][0].Mensaje,
					icon: 'success',
					confirmButtonText: 'Cerrar'
				});
				this.retornarValores.success = 1;
				this.closeDialog(this.retornarValores);
			}
		}, (error: any) => {
			this.spinner.hide();
			Swal.fire({
				title: '¡Error!',
				text: 'Error 500, al guardar las emisiónes',
				icon: 'error',
				confirmButtonText: 'Cerrar'
			});
		});
	};

	closeDialog = data => {
		this.dialogRef.close(data);
	};

	FechaDiaCorrecto(fecha) {
		return new Date(new Date(fecha).getTime() + new Date(fecha).getTimezoneOffset() * 60000)
	};

	getValFloat(valor) {
		let val = valor.toString().replace("$", "");
		val = val.replace(",", "");
		return parseFloat(val);
	};

	getValInt(valor) {
		let val = valor.toString().replace("$", "");
		val = val.replace(",", "");
		return parseInt(val);
	};
	
};
