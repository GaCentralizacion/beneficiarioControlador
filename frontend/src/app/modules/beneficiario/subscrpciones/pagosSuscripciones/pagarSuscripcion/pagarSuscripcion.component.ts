import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
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
	dataPago: any;
}

@Component({
	selector: 'app-pagarSuscripcion',
	templateUrl: './pagarSuscripcion.component.html',
	styleUrls: ['./pagarSuscripcion.component.scss']
})
export class PagarSuscripcionComponent implements OnInit {
	@ViewChild('myInputDocument') myInputEvidenceVariable: ElementRef;
	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataPago: any
	dataUsuario: any;
	today = new Date();
	limitDay: any;
	pagarSuscripcionForm: FormGroup;
	focusTabs: number = 0;
	limitPago: number = 0;
	showTabDictamen: boolean = false;
	namePcDoc: string = '';
	filedata: any;
	docCargado: boolean = false;
	guardaDictamen: boolean = true;
	accionesUsuario: any;

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<PagarSuscripcionComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private gaService: GaService,
		private spinner: NgxSpinnerService,
		private currency_pipe_object: CurrencyPipe
	) {
		this.titulo = data.title;
		this.dataPago = data.dataPago;
		if (this.dataPago.RutaGuardado !== '' && (this.dataPago.IdEstatusArchivo === null || this.dataPago.IdEstatusArchivo === 3)) {
			if (this.dataPago.IdEstatusArchivo === 3) {
				this.guardaDictamen = false;
			} else {
				this.guardaDictamen = true;
			};
			this.showTabDictamen = true;
		} else {
			this.showTabDictamen = false;
		};
	};

	ngOnInit() {
		this.accionesUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.accionesUser));
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
		let stringDate = `${this.dataPago.FechaAdquisicion.split('/')[2]}-${this.dataPago.FechaAdquisicion.split('/')[1]}-${this.dataPago.FechaAdquisicion.split('/')[0]}:14:00:00`;
		this.limitDay = new Date(stringDate);
		this.limitPago = (this.dataPago.ImporteTotal - this.dataPago.Pagado);
		this.pagarSuscripcionForm = this._formBuilder.group({
			importePago: [0, [Validators.min(0.01), Validators.max(this.limitPago), Validators.required]],
			fechaPago: [null, Validators.required]
		});
	};

	onTabChanged = e => {
		if (e === 0) {
			this.titulo = 'Pagar suscripción';
			this.pagarSuscripcionForm.reset();
			this.pagarSuscripcionForm.controls.importePago.setValue(0);
		} else {
			this.titulo = 'Agregar archivo';
			this.filedata = '';
			this.myInputEvidenceVariable.nativeElement.value = "";
			this.docCargado = false;
			this.namePcDoc = '';
		};
	};

	pagarSuscripcion = () => {
		if (this.pagarSuscripcionForm.invalid) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Completa los campos obligatorios para pagar la suscripción',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.focusTabs = 0;
			this.pagarSuscripcionForm.markAllAsTouched();
			return;
		};

		Swal.fire({
			title: `¿Quieres pagar ${this.currency_pipe_object.transform(this.pagarSuscripcionForm.controls.importePago.value)} a la suscripción?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Pagar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.spinner.show();
				const data = {
					Usuario: this.dataUsuario.IdUsuario,
					IdSubscripcion: this.dataPago.IdSubscripcion,
					ImportePago: this.pagarSuscripcionForm.controls.importePago.value,
					FechaPago: this.pagarSuscripcionForm.controls.fechaPago.value
				};
				this.gaService.postService('suscripciones/insPagos', data).subscribe((res: any) => {
					if (res[0][0].Codigo >= 1) {
						this.spinner.hide();
						Swal.fire({
							title: '¡Éxito!',
							text: res[0][0].Mensaje,
							icon: 'success',
							confirmButtonText: 'Cerrar'
						});
						this.retornarValores.success = 1;
						this.closeDialog(this.retornarValores)
					} else {
						this.spinner.hide();
						Swal.fire({
							title: '¡Error!',
							text: res[0][0].Mensaje,
							icon: 'error',
							confirmButtonText: 'Cerrar'
						});
					};
				}, (error: any) => {
					Swal.fire({
						title: '¡Error!',
						text: 'Error 500 al guardar el pago',
						icon: 'error',
						confirmButtonText: 'Cerrar'
					});
				});
			} else if (result.isDenied) {
				Swal.fire({
					title: '¡Información!',
					text: 'No se guardo la información',
					icon: 'info',
					confirmButtonText: 'Cerrar'
				});
			};
		});
	};

	async fileEvent(e) {
		try {
			if (e.target.files[0].type === "application/pdf") {
				this.namePcDoc = e.target.files[0].name;
				this.filedata = await this.toBase64(e.target.files[0]);
				this.docCargado = true;
			} else {
				this.filedata = '';
				this.myInputEvidenceVariable.nativeElement.value = "";
				this.docCargado = false;
				this.namePcDoc = '';
				Swal.fire({
					title: '¡Información!',
					text: 'Debe cargar un documento pdf',
					icon: 'info',
					confirmButtonText: 'Cerrar'
				});
			};
		} catch (error) {
			this.filedata = '';
			this.myInputEvidenceVariable.nativeElement.value = "";
			this.docCargado = false;
			this.namePcDoc = '';
			Swal.fire({
				title: '¡Información!',
				text: 'Debe cargar un documento pdf',
				icon: 'info',
				confirmButtonText: 'Cerrar'
			});
		};
	};

	guardarDictamen = () => {
		if (this.filedata === '' || this.filedata === null || this.filedata === undefined) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Seleccione un archivo',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.filedata = '';
			this.myInputEvidenceVariable.nativeElement.value = "";
			return
		};

		Swal.fire({
			title: `¿Quieres guardar el documento?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Guardar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.spinner.show();
				const data = {
					b64File: this.filedata,
					Usuario: this.dataUsuario.IdUsuario,
					IdSubscripcion: this.dataPago.IdSubscripcion,
					NombreArchivo: this.dataPago.Archivo,
					Carpeta: this.dataPago.Carpeta,
					CarpetaHeredado: this.dataPago.CarpetaHeredado,
					RutaGuardado: this.dataPago.RutaGuardado
				};

				this.gaService.postService('suscripciones/saveDictamen', data).subscribe((res: any) => {
					this.spinner.hide();
					if (res[0][0].Codigo > 0) {
						Swal.fire({
							title: '¡Listo!',
							text: res[0][0].Mensaje,
							icon: 'success',
							confirmButtonText: 'Cerrar'
						});
						this.retornarValores.success = 1;
						this.closeDialog(this.retornarValores);
					} else {
						this.retornarValores.success = 0;
						this.closeDialog(this.retornarValores);
					};
				}, (error: any) => {
					this.spinner.hide();
					Swal.fire({
						title: '¡Error!',
						text: 'Error 500 al guardar el documento',
						icon: 'error',
						confirmButtonText: 'Cerrar'
					});
				});
			} else if (result.isDenied) {
				Swal.fire({
					title: '¡Información!',
					text: 'No se guardo el documento',
					icon: 'info',
					confirmButtonText: 'Cerrar'
				});
			};
		});
	};

	actualizarDictamen = () => {
		if (this.filedata === '' || this.filedata === null || this.filedata === undefined) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Seleccione un archivo',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.filedata = '';
			this.myInputEvidenceVariable.nativeElement.value = "";
			return
		};

		Swal.fire({
			title: `¿Quieres actualizar el dictamen?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Actualizar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				const data = {
					Opcion: 1,
					Usuario: this.dataUsuario.IdUsuario,
					IdSubscripcion: this.dataPago.IdSubscripcion,
					NombreArchivo: this.dataPago.Archivo,
					ArchivoRespaldo: this.dataPago.ArchivoRespaldo,
					Carpeta: this.dataPago.Carpeta,
					CarpetaHeredado: this.dataPago.CarpetaHeredado,
					RutaGuardado: this.dataPago.RutaGuardado,
					RutaRespaldo: this.dataPago.RutaRespaldo,
					b64File: this.filedata,
					RutaRespaldoHeredado: this.dataPago.RutaRespaldoHeredado
				};

				this.spinner.show();
				this.gaService.postService('suscripciones/updDictamen', data).subscribe((res: any) => {
					this.spinner.hide();
					if (res[0][0].Codigo > 0) {
						Swal.fire({
							title: '¡Listo!',
							text: res[0][0].Mensaje,
							icon: 'success',
							confirmButtonText: 'Cerrar'
						});
						this.retornarValores.success = 1;
						this.closeDialog(this.retornarValores);
					} else {
						Swal.fire({
							title: '¡Alto!',
							text: res[0][0].Mensaje,
							icon: 'error',
							confirmButtonText: 'Cerrar'
						});
						this.retornarValores.success = 0;
						this.closeDialog(this.retornarValores);
					};
				}, (error: any) => {
					this.spinner.hide();
					Swal.fire({
						title: '¡Error!',
						text: 'Error 500 al actualizar el documento',
						icon: 'error',
						confirmButtonText: 'Cerrar'
					});
				});
			} else if (result.isDenied) {
				Swal.fire({
					title: '¡Información!',
					text: 'No se actualizo el documento',
					icon: 'info',
					confirmButtonText: 'Cerrar'
				});
			};
		});
	};

	closeDialog = data => {
		this.dialogRef.close(data);
	};

	/**CONVER FILE TO BASE64 */
	toBase64 = file => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
	/**CONVER FILE TO BASE64 */

}
