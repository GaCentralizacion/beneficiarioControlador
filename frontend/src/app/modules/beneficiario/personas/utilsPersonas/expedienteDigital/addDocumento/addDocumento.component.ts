import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
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
		console.log('allDocumentos', this.allDocumentos);
		console.log('this.dataPersona ', this.dataPersona)
	};

	async fileEvent(e) {
		try {
			if (e.target.files[0].type === "application/pdf") {
				console.log('e.target.files[0]', e.target.files[0])
				this.namePcDoc = e.target.files[0].name;
				this.filedata = await this.toBase64(e.target.files[0]);
				this.docCargado = true;
				console.log('this.filedata', this.filedata)
			} else {
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

	guardarDocumento = () => {

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
};
