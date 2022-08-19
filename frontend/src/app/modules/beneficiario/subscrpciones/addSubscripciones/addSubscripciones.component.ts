import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { filter } from 'rxjs/operators';
import { filters } from '../../../../mock-api/apps/mailbox/data';

/**
 * Obtenemos el Mensaje a mostrar
 */
export interface SendData {
	title: string;
	dataEmpresa: any;
}

@Component({
	selector: 'app-addSubscripciones',
	templateUrl: './addSubscripciones.component.html',
	styleUrls: ['./addSubscripciones.component.scss']
})
export class AddSubscripcionesComponent implements OnInit {
	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataUsuario: any
	dataEmpresa: any
	subscripcionesForm: FormGroup;
	allSubscriptores: any;
	personaSubscriptora: any;
	showSelectConceptos: boolean = false;
	allConceptos: any;
	conceptoSelecionado: any;
	showFieldsImportePrecioVenta: boolean = false;
	showSelectPersonaDestino: boolean = false;
	allPersonasDestino: any;
	allSeries: any
	showAllfields: boolean = false;
	serieSeleccionada: any;
	readOnlyeCantidad: boolean = true;
	showAllFrom: boolean = false;
	maxLengthTextArea: number = 8000;
	today = new Date();
	fechaAquisicionInput: any;
	placeHolderCantidad: string = 'Máximo';

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<AddSubscripcionesComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private gaService: GaService,
		private spinner: NgxSpinnerService
	) {
		this.titulo = data.title;
		this.dataEmpresa = data.dataEmpresa;
	};

	ngOnInit() {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;

		let dateObject = [year, month, day].join('-');
		this.fechaAquisicionInput = this.FechaDiaCorrecto(dateObject);

		this.subscripcionesForm = this._formBuilder.group({
			razonSocial: [this.dataEmpresa.RazonSocial, Validators.required],
			subscriptor: [0, Validators.min(1)],
			concepto: [0, Validators.min(1)],
			personaDestino: [0, Validators.min(1)],
			serie: [0, Validators.min(1)],
			valorUnitario: [null, Validators.required],
			cantidad: [null, Validators.required],
			importe: [null, Validators.required],
			precioVenta: [Validators.required],
			importeVenta: [Validators.required],
			observaciones: ['', Validators.maxLength(this.maxLengthTextArea)],
			fechaAdqusicion: ['', Validators.required],
		});
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
		this.getAllSubscritores();
	};

	getAllSubscritores = () => {
		const data = {
			Opcion: 1,
			IdPersona: this.dataEmpresa.IdPersona,
			IdPersonaSubscripcion: null,
			IdConcepto: null
		};
		this.gaService.postService('subscripciones/selAllTransacciones', data).subscribe((res: any) => {
			if (res[0].length > 0) {
				this.allSubscriptores = res[0];
				this.subscripcionesForm.controls.subscriptor.setValue(0);
			} else {
				Swal.fire({
					title: '¡Alto!',
					text: 'No se obtuvieron los subscriptores',
					icon: 'warning',
					confirmButtonText: 'Cerrar'
				});
			};
		}, (error: any) => {
			Swal.fire({
				title: '¡Error!',
				text: error.error.text,
				icon: 'error',
				confirmButtonText: 'Cerrar'
			});
		});
	};

	getAllConceptos = e => {
		this.clearAllForm();
		this.personaSubscriptora = [];
		if (e !== 0) {
			this.personaSubscriptora = this.allSubscriptores.filter(x => x.IdPersonaSubscripcion === e);
			const data = {
				Opcion: 2,
				IdPersona: this.dataEmpresa.IdPersona,
				IdPersonaSubscripcion: this.personaSubscriptora[0].IdPersonaSubscripcion,
				IdConcepto: null
			};
			this.gaService.postService('subscripciones/selAllTransacciones', data).subscribe((res: any) => {
				if (res[0].length > 0) {
					this.allConceptos = res[0];
					this.subscripcionesForm.controls.concepto.setValue(0);
					this.showAllFrom = true;
				} else {
					Swal.fire({
						title: '¡Alto!',
						text: 'No se obtuvieron los conceptos del subscriptor',
						icon: 'warning',
						confirmButtonText: 'Cerrar'
					});
				};
			}, (error: any) => {
				Swal.fire({
					title: '¡Error!',
					text: error.error.text,
					icon: 'error',
					confirmButtonText: 'Cerrar'
				});
			});
			this.showSelectConceptos = true;
		} else {
			this.showAllFrom = false;
			this.showSelectConceptos = false;
		};
	};

	getAllPersonasDestino = e => {
		this.subscripcionesForm.controls.cantidad.setValue(null);
		this.subscripcionesForm.controls.cantidad.markAsTouched();
		this.subscripcionesForm.controls.valorUnitario.setValue(null);
		this.subscripcionesForm.controls.valorUnitario.markAsTouched();
		this.subscripcionesForm.controls.importe.setValue(null);
		this.subscripcionesForm.controls.importe.markAsTouched();
		this.conceptoSelecionado = []
		this.conceptoSelecionado = this.allConceptos.filter(x => x.IdConcepto === e);
		if (this.conceptoSelecionado[0].AplicaPersonaDestino !== 0) {
			const data = {
				Opcion: 3,
				IdPersona: this.dataEmpresa.IdPersona,
				IdPersonaSubscripcion: this.personaSubscriptora[0].IdPersonaSubscripcion,
				IdConcepto: this.conceptoSelecionado[0].IdConcepto
			};
			this.gaService.postService('subscripciones/selAllTransacciones', data).subscribe((res: any) => {
				if (res.length > 0) {
					this.allPersonasDestino = res[0];
					this.subscripcionesForm.controls.personaDestino.setValue(0);
					this.subscripcionesForm.controls.fechaAdqusicion.setValue(this.fechaAquisicionInput);
					this.showSelectPersonaDestino = true;
				} else {
					Swal.fire({
						title: '¡Alto!',
						text: 'No se obtuvieron las personas destino',
						icon: 'warning',
						confirmButtonText: 'Cerrar'
					});
				};
			}, (error: any) => {
				Swal.fire({
					title: '¡Error!',
					text: error.error.text,
					icon: 'error',
					confirmButtonText: 'Cerrar'
				});
			});
			this.getAllSeries();
		} else {
			this.subscripcionesForm.controls.fechaAdqusicion.setValue(this.fechaAquisicionInput);
			this.showSelectPersonaDestino = false;
			this.subscripcionesForm.controls.personaDestino.clearValidators()
			this.subscripcionesForm.controls.personaDestino.updateValueAndValidity();
			this.getAllSeries();
		};
	};

	getAllSeries = () => {
		const data = {
			Opcion: 4,
			IdPersona: this.dataEmpresa.IdPersona,
			IdPersonaSubscripcion: this.personaSubscriptora[0].IdPersonaSubscripcion,
			IdConcepto: this.conceptoSelecionado[0].IdConcepto
		};
		this.gaService.postService('subscripciones/selAllTransacciones', data).subscribe((res: any) => {
			if (res.length > 0) {
				this.allSeries = res[0];
				this.showAllfields = true;
				this.subscripcionesForm.controls.serie.setValue(0);

				//Se valida si se muestran los inputs de los precions de venta
				if (this.conceptoSelecionado[0].IdConcepto === 5) {
					this.subscripcionesForm.controls.precioVenta.setValue(null);
					this.subscripcionesForm.controls.precioVenta.addValidators([Validators.required]);
					this.subscripcionesForm.controls.precioVenta.updateValueAndValidity();
					this.subscripcionesForm.controls.importeVenta.setValue(null);
					this.subscripcionesForm.controls.importeVenta.addValidators([Validators.required]);
					this.subscripcionesForm.controls.importeVenta.updateValueAndValidity();
					this.showFieldsImportePrecioVenta = true;
				} else {
					this.showFieldsImportePrecioVenta = false;
					this.subscripcionesForm.controls.precioVenta.setValue(0);
					this.subscripcionesForm.controls.precioVenta.clearValidators();
					this.subscripcionesForm.controls.precioVenta.updateValueAndValidity();
					this.subscripcionesForm.controls.importeVenta.setValue(0);
					this.subscripcionesForm.controls.importeVenta.clearValidators();
					this.subscripcionesForm.controls.importeVenta.updateValueAndValidity();
				};
			} else {
				Swal.fire({
					title: '¡Alto!',
					text: 'No se obtuvieron las series',
					icon: 'warning',
					confirmButtonText: 'Cerrar'
				});
			};
		}, (error: any) => {
			Swal.fire({
				title: '¡Error!',
				text: error.error.text,
				icon: 'error',
				confirmButtonText: 'Cerrar'
			});
		});
	};

	getAllDataSerie = e => {
		if (e !== 0) {
			this.placeHolderCantidad = 'Máximo';
			this.serieSeleccionada = [];
			this.serieSeleccionada = this.allSeries.filter(x => x.Serie === e);
			this.placeHolderCantidad = `Máximo ${this.serieSeleccionada[0].Disponibles}`
			this.subscripcionesForm.controls.valorUnitario.setValue(this.serieSeleccionada[0].ValorUnitario);
			this.subscripcionesForm.controls.cantidad.setValue(null);
			this.subscripcionesForm.controls.importe.setValue(null);
			this.subscripcionesForm.controls.cantidad.clearValidators()
			this.subscripcionesForm.controls.cantidad.updateValueAndValidity();
			setTimeout(() => {
				this.subscripcionesForm.controls.cantidad.addValidators([Validators.min(1), Validators.max(this.serieSeleccionada[0].Disponibles)])
				this.subscripcionesForm.controls.cantidad.updateValueAndValidity();
			}, 500);
			this.readOnlyeCantidad = false;
		} else {
			this.placeHolderCantidad = 'Máximo';
			this.readOnlyeCantidad = true;
			this.subscripcionesForm.controls.cantidad.setValue(null);
			this.subscripcionesForm.controls.cantidad.markAsTouched();
			this.subscripcionesForm.controls.valorUnitario.setValue(null);
			this.subscripcionesForm.controls.valorUnitario.markAsTouched();
			this.subscripcionesForm.controls.importe.setValue(null);
			this.subscripcionesForm.controls.importe.markAsTouched();
			this.serieSeleccionada = [];
		};
	};

	cantidadOnChangeEvent = e => {
		if (e !== 0 || e !== '' || e !== null || e !== undefined) {
			if (this.subscripcionesForm.controls.cantidad.invalid) {
				this.subscripcionesForm.controls.importe.setValue(null);
			} else {
				let importe = (this.subscripcionesForm.controls.valorUnitario.value * e);
				this.subscripcionesForm.controls.importe.setValue(importe);
			};
		} else {
			this.subscripcionesForm.controls.importe.setValue(null);
		};
	};

	guardarSubscripcion = () => {
		if (this.subscripcionesForm.invalid) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Completa los campos obligatorios',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.subscripcionesForm.markAllAsTouched();
			return;
		};

		Swal.fire({
			title: `¿Estas seguro de guardar la subscripción?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Guardar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.spinner.show();

				const dataSend = {
					Usuario: this.dataUsuario.IdUsuario,
					IdPersona: this.dataEmpresa.IdPersona,
					IdPersonaSubscripcion: this.subscripcionesForm.controls.subscriptor.value,
					IdConcepto: this.subscripcionesForm.controls.concepto.value,
					IdPersonaDestino: this.subscripcionesForm.controls.personaDestino.value === 0 ? null : this.subscripcionesForm.controls.personaDestino,
					Serie: this.subscripcionesForm.controls.serie.value,
					Cantidad: this.subscripcionesForm.controls.cantidad.value,
					FechaAduisicion: this.subscripcionesForm.controls.fechaAdqusicion.value,
					Observaciones: this.subscripcionesForm.controls.observaciones.value,
					PrecioUnitarioVenta: this.subscripcionesForm.controls.precioVenta.value === 0 ? null : this.subscripcionesForm.controls.precioVenta.value,
					ImporteVenta: this.subscripcionesForm.controls.importeVenta.value === 0 ? null : this.subscripcionesForm.controls.importeVenta.value
				};

				this.gaService.postService('subscripciones/insSubscripciones', dataSend).subscribe((res: any) => {
					this.spinner.hide();
					if (res[0][0].Codigo < 0) {
						Swal.fire({
							title: '¡Alto!',
							text: res[0][0].Mensaje,
							icon: 'warning',
							confirmButtonText: 'Cerrar'
						});
					} else {
						Swal.fire({
							title: '¡Listo!',
							text: res[0][0].Mensaje,
							icon: 'success',
							confirmButtonText: 'Cerrar'
						});
						this.retornarValores.success = 1;
						this.closeDialog(this.retornarValores);
					};
				}, (error: any) => {
					this.spinner.hide();
					Swal.fire({
						title: '¡Error!',
						text: error.error.text,
						icon: 'error',
						confirmButtonText: 'Cerrar'
					});
				});
			} else if (result.isDenied) {
				Swal.fire({
					title: '¡Información!',
					text: 'No se guardo la relación familiar.',
					icon: 'info',
					confirmButtonText: 'Cerrar'
				});
			};
		});
	};

	clearAllForm = () => {
		this.subscripcionesForm.controls.concepto.setValue(0);
		this.subscripcionesForm.controls.personaDestino.setValue(0);
		this.subscripcionesForm.controls.serie.setValue(0);
		this.subscripcionesForm.controls.valorUnitario.setValue(null);
		this.subscripcionesForm.controls.cantidad.setValue(null);
		this.subscripcionesForm.controls.importe.setValue(null);
		this.subscripcionesForm.controls.precioVenta.setValue(null);
		this.subscripcionesForm.controls.importeVenta.setValue(null);
		this.subscripcionesForm.controls.fechaAdqusicion.setValue("");
	};

	closeDialog = data => {
		this.dialogRef.close(data);
	};

	FechaDiaCorrecto(fecha) {
		return new Date(new Date(fecha).getTime() + new Date(fecha).getTimezoneOffset() * 60000)
	};
};
