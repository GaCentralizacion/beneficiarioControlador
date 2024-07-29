import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { GaService } from 'app/services/ga.service';
import { environment } from 'environments/environment';

export interface SendData {
	title: string;
	dataPersona: any;
};

@Component({
    selector: 'app-razonesSocialesUpd',
    templateUrl: './razonesSocialesUpd.component.html',
    styleUrls: ['./razonesSocialesUpd.component.scss']
})

export class RazonesSocialesUpdComponent implements OnInit {

    retornarValores = { success: 0, data: {} };
    titulo: string;
	dataPersona: any;
    razonForm: FormGroup;
    today = new Date();
    dataUsuario: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: SendData,
        private spinner: NgxSpinnerService,
        private gaService: GaService,
        public dialogRef: MatDialogRef<RazonesSocialesUpdComponent>,
    ) {
        this.dataPersona = data.dataPersona;
        this.titulo = `${data.title} ${this.dataPersona?.Nombre_RazonSocial}`;
    };

    ngOnInit(): void {
        this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
        this.razonForm = this._formBuilder.group({
            razonSocial: ['', Validators.required],
            fechaRazon: ['', Validators.required],
        });
        console.log( 'this.dataPersona', this.dataPersona )
    };

    guardarRazon = () =>{
        if( this.razonForm.invalid ){
            Swal.fire({
				title: '¡Alto!',
				text: 'Completa los campos obligatorios',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.razonForm.markAllAsTouched();
			return;
        };

        Swal.fire({
			title: `¿Estas seguro de cambiar la razón social?`,
			showDenyButton: true,
			confirmButtonText: 'Guardar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.spinner.show();

                const data = {
                    IdPersona: this.dataPersona?.IdPersona,
                    RazonSocial: this.razonForm.controls.razonSocial.value,
                    Fecha_Cambio: this.razonForm.controls.fechaRazon.value,
                    Usuario: this.dataUsuario.IdUsuario
                };

				this.gaService.postService('personas/insRazonSocial', data).subscribe((res: any) => {
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
					text: 'No se guardo la razón social.',
					icon: 'info',
					confirmButtonText: 'Cerrar'
				});
			};
		});
    };

    closeDialog = data => {
		this.dialogRef.close(data);
	};
};
