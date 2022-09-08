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
    dataPago: any;
}

@Component({
    selector: 'app-showDictamen',
    templateUrl: 'showDictamen.component.html',
    styleUrls: ['./showDictamen.component.scss']
})

export class ShowDictamenComponent implements OnInit {
    title: string;
    urlGet: string;
    public thumbnail: SafeResourceUrl;
    showPdf: boolean = true;
    rechazaDocumentoForm: FormGroup;
    dataPago: any;
    dataUsuario: any;
    maxLengthTextArea: number = 8000;
    readyPdf: boolean = false;

    retornarValores = { success: 0, data: {} };
    accionesUsuario: any;

    constructor(private fb: FormBuilder,
        private sanitizer: DomSanitizer,
        public dialogRef: MatDialogRef<ShowDictamenComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SendData,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private gaService: GaService,
        private spinner: NgxSpinnerService) {
        this.title = data.title;
        this.urlGet = data.urlGet;
        this.dataPago = data.dataPago;
        this.rechazaDocumentoForm = this.fb.group({
            observaciones: ['']
        });
    };

    ngOnInit() {
        this.accionesUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.accionesUser));
        this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
        setTimeout(() => {
            this.showDocumentoFn();
        }, 10);
    };

    showDocumentoFn = () => {
        this.thumbnail = '';
        this.thumbnail = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlGet);
        this.readyPdf = true;
    };

    aprobarDocumento = () => {
        Swal.fire({
            title: `¿Quieres aprobar el dictamen?`,
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Aprobar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                const data = {
                    Opcion: 2,
                    Usuario: this.dataUsuario.IdUsuario,
                    IdSubscripcion: this.dataPago.IdSubscripcion,
                    IdEstatusArchivo: 1,
                    Observacion: null
                };

                this.gaService.postService('suscripciones/updEstatusDocumento', data).subscribe((res: any) => {
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
                            icon: 'warning',
                            confirmButtonText: 'Cerrar'
                        });
                        this.retornarValores.success = 0;
                        this.closeDialog(this.retornarValores);
                    };
                }, (error: any) => {
                    this.spinner.hide();
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Error 500 al aprobar el documento',
                        icon: 'error',
                        confirmButtonText: 'Cerrar'
                    });
                });
            } else {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se realizo ninguna acción',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            };
        });
    };

    rechazarDocumento = () => {
        if (this.rechazaDocumentoForm.invalid) {
            Swal.fire({
                title: '¡Alto!',
                text: 'Ingresa la razón del rechazo.',
                icon: 'warning',
                confirmButtonText: 'Cerrar'
            });
            this.rechazaDocumentoForm.markAllAsTouched();
            return
        };

        Swal.fire({
            title: `¿Quieres rechazar el dictamen?`,
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Rechazar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                const data = {
                    Opcion: 2,
                    Usuario: this.dataUsuario.IdUsuario,
                    IdSubscripcion: this.dataPago.IdSubscripcion,
                    IdEstatusArchivo: 3,
                    Observacion: this.rechazaDocumentoForm.controls.observaciones.value
                };
                this.gaService.postService('suscripciones/updEstatusDocumento', data).subscribe((res: any) => {
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
                            icon: 'warning',
                            confirmButtonText: 'Cerrar'
                        });
                        this.retornarValores.success = 0;
                        this.closeDialog(this.retornarValores);
                    };
                }, (error: any) => {
                    this.spinner.hide();
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Error 500 al aprobar el documento',
                        icon: 'error',
                        confirmButtonText: 'Cerrar'
                    });
                });
            } else {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se realizo ninguna acción',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            };
        });
    };

    showComentariosRechazoDocumento = accion => {
        this.rechazaDocumentoForm.controls.observaciones.setValue('');
        if (accion === 1) {
            this.rechazaDocumentoForm.controls.observaciones.addValidators([Validators.required, Validators.maxLength(this.maxLengthTextArea)]);
            this.rechazaDocumentoForm.controls.observaciones.updateValueAndValidity();
            this.showPdf = false;
        } else {
            this.rechazaDocumentoForm.controls.observaciones.clearValidators();
            this.rechazaDocumentoForm.controls.observaciones.updateValueAndValidity();
            this.showPdf = true;
        };
    };

    closeDialog = data => {
        this.dialogRef.close(data);
    };


};