import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

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
	today = new Date();
	limitDay: any;
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
	showFechaDocumento: boolean;
	vigenciaDinamica: boolean;
	allVigenciasDinamicas: any;
	vigenciaActual: any;
    escrituraPublica: boolean = false;
    allEmpresas: any;

    // VARIABLES DE FILTRO
    documentosFilterCtrl = new FormControl();
    filteredDocumentos: Observable<any[]>;
    @ViewChild('documentoSelect') documentoSelect: MatSelect;

    empresaFilterCtrl = new FormControl();
    filteredEmpresas: Observable<any[]>;
    @ViewChild('empresaSelect') empresaSelect: MatSelect;

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
		this.allDocumentos = data.allDocumentos.filter(x => {
			return x.IdEstatusArchivo === 2 || x.IdEstatusArchivo === 3 || x.IdEstatusArchivo === null
		});

        this.filteredDocumentos = this.documentosFilterCtrl.valueChanges.pipe(startWith(''), map(value => this.filterDocumentos(value)));
        this.filteredEmpresas = this.empresaFilterCtrl.valueChanges.pipe(startWith(''), map(value => this.filterEmpresas(value)));
	};

	ngOnInit() {
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
		this.documentosForm = this._formBuilder.group({
			idDocumento: [0, Validators.min(1)],
			idVigencias: [0],
			fechaDocumento: [null, Validators.required],
            idEmpresaMoral: [0]
		});
        this.filteredDocumentos = this.documentosFilterCtrl.valueChanges.pipe(
            startWith(''),
            map(documentos => (documentos ? this.filterDocumentos(documentos) : this.allDocumentos?.slice()))
        );
        this.filteredEmpresas = this.empresaFilterCtrl.valueChanges.pipe(
            startWith(''),
            map(empresas => (empresas ? this.filterEmpresas(empresas) : this.allEmpresas?.slice()))
        );
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
            this.vigenciaDinamica = false;
			this.documentosForm.controls.idVigencias.setValue(0);
			this.documentosForm.controls.idVigencias.clearValidators();
			this.documentosForm.controls.idVigencias.updateValueAndValidity();
			this.documentosForm.controls.fechaDocumento.setValue(null);
            this.documentosForm.controls.idEmpresaMoral.setValue(0);
            this.documentosForm.controls.idEmpresaMoral.clearValidators();
            this.documentosForm.controls.idEmpresaMoral.updateValueAndValidity();
			this.vigenciaActual = [];
			this.showFechaDocumento = false;
			this.showBtns = true;
            this.escrituraPublica = false;
			this.dataDocumento = this.allDocumentos.filter(x => x.IdDocumento === e);
            if( this.dataDocumento[0].Multiple === 0 ){
                if (this.dataDocumento[0].IdExpPer === null) {
                    this.showBtnActualizar = false;
                } else {
                    this.showBtnActualizar = true;
                };

                //TIENE VIGENCIADINAMICA NO
                if (this.dataDocumento[0].VigenciaDinamica === 0) {
                    if (this.dataDocumento[0].Vigencia === '') {
                        this.documentosForm.controls.fechaDocumento.setValue(null);
                        this.documentosForm.controls.fechaDocumento.clearValidators();
                        this.documentosForm.controls.fechaDocumento.updateValueAndValidity();
                        this.showFechaDocumento = false;
                    } else {
                        this.limitDay = new Date(this.dataDocumento[0].FechaVigenciaPermitida + ':14:00:00');
                        this.documentosForm.controls.fechaDocumento.addValidators(Validators.required);
                        this.documentosForm.controls.fechaDocumento.updateValueAndValidity();
                        this.showFechaDocumento = true;
                    };
                } else {
                    const data = {
                        IdDocTipPer: this.dataDocumento[0].IdDocTipPer
                    };
                    this.spinner.show();
                    this.gaService.postService('personas/selVigenciasDinamicas', data).subscribe((res: any) => {
                        this.spinner.hide();
                        this.allVigenciasDinamicas = res[0];
                        this.documentosForm.controls.idVigencias.addValidators(Validators.min(1));
                        this.documentosForm.controls.idVigencias.updateValueAndValidity();
                        this.vigenciaDinamica = true;
                    }, (error: any) => {
                        this.spinner.hide();
                        Swal.fire({
                            title: '¡Error!',
                            text: 'Error 500 al traer las vigencias dinamicas.',
                            icon: 'error',
                            confirmButtonText: 'Cerrar'
                        });
                    });
                };
                //SI--- TRAEMOS LOS TIPO DE VIGENCIA con el IdDocTipPer Y MOSTRAMOS EL DROPDOWN
                //SELECCIONA EL TIPO DE VIGENCIA Y TRAEMOS LA VIGENCIA YA CON FECHAS CALCULADAS PARA EL PICKET DE FECHA
                //SELECCIONA LA VIGENCIA Y SE CALCULA LA FECHA EN EL PICKER Y SE MUESTRA
            }else{
                if( this.dataDocumento[0].IdDocumento === 16 ){
                    this.documentosForm.controls.fechaDocumento.setValue(null);
                    this.documentosForm.controls.fechaDocumento.clearValidators();
                    this.documentosForm.controls.fechaDocumento.updateValueAndValidity();
                    const data = {
                        IdPersona: this.dataDocumento[0].IdPersona
                    };
                    this.gaService.postService('personas/selEmpresasAccionista', data).subscribe((res: any) => {
                        this.spinner.hide();
                        this.documentosForm.controls.idEmpresaMoral.addValidators(Validators.min(1));
                        this.documentosForm.controls.idEmpresaMoral.updateValueAndValidity();
                        this.escrituraPublica = true;
                        this.allEmpresas = res[0];
                    }, (error: any) => {
                        this.spinner.hide();
                        Swal.fire({
                            title: '¡Error!',
                            text: 'Error 500 al traer las empresas para el documento.',
                            icon: 'error',
                            confirmButtonText: 'Cerrar'
                        });
                    });
                };
            };
		};
	};

	vigenciaSelected = e => {
		if (e === 0) {
			this.showFechaDocumento = false;
			this.documentosForm.controls.idVigencias.markAllAsTouched();
		} else {
			this.vigenciaActual = this.allVigenciasDinamicas.filter(x => x.IdTipoVigencia === e);
			this.limitDay = new Date(this.vigenciaActual[0].FechaVigenciaPermitida + ':14:00:00');
			this.showFechaDocumento = true;
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
				text: 'Complete los datos obligatorios',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.documentosForm.markAllAsTouched();
			return
		};

		Swal.fire({
			title: `¿Quieres guardar el ${this.dataDocumento[0].Documento}?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Guardar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
                const archivoidExpMul = this.allEmpresas?.filter(x => x.IdPersonaMoral === this.documentosForm.controls.idEmpresaMoral.value);
                const nombreArchivo = this.dataDocumento[0].Multiple === 1 ? archivoidExpMul[0].Archivo : this.dataDocumento[0].Archivo;
				const data = {
					b64File: this.filedata,
					IdDocumento: this.documentosForm.controls.idDocumento.value,
					nombreArchivo: nombreArchivo,
					carpetaPersona: this.dataDocumento[0].Carpeta,
					idPersona: this.dataDocumento[0].IdPersona,
					rutaGuardado: this.dataDocumento[0].RutaGuardado,
					fechaDocumento: this.documentosForm.controls.fechaDocumento.value,
					idUsuario: this.dataUsuario.IdUsuario,
					CarpetaHeredado: this.dataDocumento[0].CarpetaHeredado,
					vigenciaDinamica: this.vigenciaActual.length > 0 ? this.vigenciaActual[0].Vigencia : null,
					tipoVigenciaDinamica: this.vigenciaActual.length > 0 ? this.vigenciaActual[0].VigenciaTipo : null,
                    IdExpMulPer: archivoidExpMul ? archivoidExpMul[0].IdExpMulPer : null
				};

				this.spinner.show();
				this.gaService.postService('personas/saveDocumentoExpediente', data).subscribe((res: any) => {
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
							title: '¡Error!',
							text: res[0][0].Mensaje,
							icon: 'error',
							confirmButtonText: 'Cerrar'
						});
						this.retornarValores.success = 0;
						this.closeDialog(this.retornarValores);
					}
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

		Swal.fire({
			title: `¿Quieres actualizar el ${this.dataDocumento[0].Documento}?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Actualizar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				const data = {
					Opcion: 1,
					Usuario: this.dataUsuario.IdUsuario,
					IdExpPer: this.dataDocumento[0].IdExpPer,
					FechaDocumento: this.documentosForm.controls.fechaDocumento.value,
					IdEstatusArchivo: null,
					Observacion: null,
					nombreDocumento: this.dataDocumento[0].Archivo,
					nombreDocumentoRespaldo: this.dataDocumento[0].ArchivoRespaldo,
					carpeta: this.dataDocumento[0].Carpeta,
					carpetaHeredado: this.dataDocumento[0].CarpetaHeredado,
					idDocumento: this.dataDocumento[0].IdDocumento,
					idPersona: this.dataDocumento[0].IdPersona,
					rutaGuardado: this.dataDocumento[0].RutaGuardado,
					rutaRespaldo: this.dataDocumento[0].RutaRespaldo,
					b64File: this.filedata,
					RutaRespaldoHeredado: this.dataDocumento[0].RutaRespaldoHeredado,
					vigenciaDinamica: this.vigenciaActual.length > 0 ? this.vigenciaActual[0].Vigencia : null,
					tipoVigenciaDinamica: this.vigenciaActual.length > 0 ? this.vigenciaActual[0].VigenciaTipo : null
				};

				this.spinner.show();
				this.gaService.postService('personas/updateDocumento', data).subscribe((res: any) => {
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

    filterDocumentos(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.allDocumentos?.filter(documentos => documentos.Documento.toLowerCase().includes(filterValue));
    };

    filterEmpresas(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.allEmpresas?.filter(empresas => empresas.Nombre_RazonSocial.toLowerCase().includes(filterValue));
    };

    eraseDocumentos(){
        this.documentosForm.controls.idDocumento.setValue(0);
        this.documentosForm.controls.idVigencias.setValue(null);
        this.documentosForm.controls.fechaDocumento.setValue(null);
        this.documentosForm.controls.idEmpresaMoral.setValue(0);
        this.showFechaDocumento = false;
        this.vigenciaDinamica = false;
        this.escrituraPublica = false;
        if (this.documentoSelect) {
            this.documentoSelect.close();
        };
    };

    onMatSelectBlur = e => {
        setTimeout(() => {
            this.documentosFilterCtrl.setValue('');
        }, 200);
    };

    onMatSelectBlurEmpresas = e => {
        setTimeout(() => {
            this.empresaFilterCtrl.setValue('');
        }, 200);
    };

    eraseEmpresas(){
        this.documentosForm.controls.idEmpresaMoral.setValue(0);
        if (this.empresaSelect) {
            this.empresaSelect.close();
        };
    };

    // regresaNombreDocumento = (idDocumento, nombre) => {
    //     console.log( 'nombre', nombre )
    //     if(idDocumento === 16){
    //         const complemento = this.allEmpresas.filter(x => x.IdPersonaMoral === this.documentosForm.controls.idEmpresaMoral.value);
    //         console.log( 'complemento', complemento )
    //         const nombreRazonSocialConGuionesBajos = complemento[0].Nombre_RazonSocial.trim().replace(/[^a-zA-Z0-9\s_]/g, '').replace(/\s+/g, '_');
    //         nombre = nombre.replace(".pdf", `_${nombreRazonSocialConGuionesBajos}.pdf`)
    //     };
    //     console.log( 'nombre', nombre )
    //     return nombre;
    // };
};
