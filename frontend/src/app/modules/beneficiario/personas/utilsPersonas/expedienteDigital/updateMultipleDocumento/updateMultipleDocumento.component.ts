import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { GaService } from 'app/services/ga.service';
import { NgxSpinnerService } from "ngx-spinner";

export interface SendData {
    title: string;
    urlGet: string;
    allDataDocumento: any;
}

@Component({
    selector: 'app-updateMultipleDocumento',
    templateUrl: 'updateMultipleDocumento.component.html',
    styleUrls: ['./updateMultipleDocumento.component.scss']
})

export class UpdateMultipleDocumentoComponent implements OnInit {
    title: string;
    allDataDocumento: any;
    dataUsuario: any;

    retornarValores = { success: 0, data: {} };
    accionesUsuario: any;

    documentosForm: FormGroup;
    docCargado: boolean = false;
    showForm: boolean = false;
    namePcDoc: string = '';
    filedata: any;
    @ViewChild('myInputDocument') myInputEvidenceVariable: ElementRef;

    constructor(private fb: FormBuilder,
        private sanitizer: DomSanitizer,
        public dialogRef: MatDialogRef<UpdateMultipleDocumentoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SendData,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private gaService: GaService,
        private spinner: NgxSpinnerService) {
        this.title = data.title;
        this.allDataDocumento = data.allDataDocumento;
    };

    ngOnInit() {
        this.accionesUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.accionesUser));
        this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
        this.documentosForm = this.fb.group({
			idDocumento: [this.allDataDocumento.IdDocumento, Validators.required],
            idEmpresaMoral: [this.allDataDocumento.IdPersonaMoral, Validators.required],
            IdExpMulPer: [this.allDataDocumento.IdExpMulPer, Validators.required],
            nombreDocumento: [this.allDataDocumento.Documento],
            nombreEmpresa: [this.allDataDocumento.Nombre_RazonSocial]
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

    actualizarDocumento = () =>{
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
				text: 'Faltan datos para la actualización',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.documentosForm.markAllAsTouched();
			return
		};

        Swal.fire({
			title: `¿Quieres actualizar el ${this.allDataDocumento.Documento} para la empresa ${this.allDataDocumento.Nombre_RazonSocial}?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Actualizar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				const data = {
					Opcion: 2,
					Usuario: this.dataUsuario.IdUsuario,
					IdExpMulPer: this.allDataDocumento.IdExpMulPer,
					IdEstatusArchivo: 4,
					Observacion: null,
					nombreDocumento: this.allDataDocumento.Archivo,
					nombreDocumentoRespaldo: this.allDataDocumento.ArchivoRespaldo,
					carpeta: this.allDataDocumento.Carpeta,
					idDocumento: this.allDataDocumento.IdDocumento,
					idPersona: this.allDataDocumento.IdPersona,
					rutaGuardado: this.allDataDocumento.RutaGuardado,
					rutaRespaldo: this.allDataDocumento.RutaRespaldo,
					b64File: this.filedata,
                    IdPersonaMoral: this.allDataDocumento.IdPersonaMoral,
                    FechaDocumento: null
				};

                this.spinner.show();
				this.gaService.postService('personas/updateMultiDocumento', data).subscribe((res: any) => {
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

};
