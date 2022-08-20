import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { filter } from 'rxjs/operators';
import { Mail } from '../../../../../admin/apps/mailbox/mailbox.types';

/**
 * Obtenemos el Mensaje a mostrar
 */
export interface SendData {
	title: string;
	dataPersona: any;
	allDocumentos: any;
}

@Component({
	selector: 'app-addDocumento',
	templateUrl: './addDocumento.component.html',
	styleUrls: ['./addDocumento.component.scss']
})
export class AddDocumentoComponent implements OnInit {
	@ViewChild('myInputDocument') myInputEvidenceVariable: ElementRef;

	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataUsuario: any;
	dataPersona: any;
	allDocumentos: any;
	filedata: any;
	docCargado: boolean = false;
	namePcDoc: string = '';
	showForm: boolean = false;
	showBtns: boolean = false;
	documentosForm: FormGroup;
	showBtnActualizar: boolean;
	dataDocumento: any;

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<AddDocumentoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private gaService: GaService,
		private spinner: NgxSpinnerService
	) {
		this.titulo = data.title;
		this.dataPersona = data.dataPersona;
		this.allDocumentos = data.allDocumentos
	};

	ngOnInit() {
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
		this.documentosForm = this._formBuilder.group({
			idDocumento: [0, Validators.min(1)]
		});
	};

	async fileEvent(e) {
		try {
			if (e.target.files[0].type === "application/pdf") {
				this.namePcDoc = e.target.files[0].name;
				this.filedata = await this.toBase64(e.target.files[0]);
				this.docCargado = true;
				this.showForm = true;
			} else {
				this.filedata = '';
				this.myInputEvidenceVariable.nativeElement.value = "";
				this.docCargado = false;
				this.showForm = false;
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
			this.showForm = false;
			this.namePcDoc = '';
			Swal.fire({
				title: '¡Información!',
				text: 'Debe cargar un documento pdf',
				icon: 'info',
				confirmButtonText: 'Cerrar'
			});
		};
	};

	documentoSelected = e => {
		if (e === 0) {
			this.showBtns = false;
		} else {
			this.showBtns = true;
			this.dataDocumento = this.allDocumentos.filter(x => x.IdDocumento === e);
			if (this.dataDocumento[0].IdExpPer === null) {
				this.showBtnActualizar = false;
			} else {
				this.showBtnActualizar = true;
			};
		};
	};

	guardarDocumento = () => {
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

		if (this.documentosForm.invalid) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Seleccione el documento que se va a guardar',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.documentosForm.markAllAsTouched();
			return
		};

		const data = {
			b64File: this.filedata,
			IdDocumento: this.documentosForm.controls.idDocumento.value,
			ruta: 'C:\\app\\public\\Imagenes\\beneficiarioControlador\\',
			nombreArchivo: `documento_${this.dataDocumento[0].IdPersona}.${this.dataDocumento[0].Extencion}`
		};

		Swal.fire({
			title: `¿Quieres guardar el documento para el expediente de ${this.dataDocumento[0].Nombre}?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Guardar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.spinner.show();
				this.gaService.postService('personas/saveDocumentoExpediente', data).subscribe((res: any) => {
					this.spinner.hide();
					this.retornarValores.success = 1;
					this.closeDialog(this.retornarValores);
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

	actualizarDocumento = () => {
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

		if (this.documentosForm.invalid) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Seleccione el documento que se va a guardar',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.documentosForm.markAllAsTouched();
			return
		};

		const data = {
			b64File: this.filedata,
			IdDocumento: this.documentosForm.controls.idDocumento.value
		};
		console.log('data', data)
	}

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
};
