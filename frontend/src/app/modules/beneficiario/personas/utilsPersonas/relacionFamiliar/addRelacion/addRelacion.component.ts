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
	dataPersona: any;
	catRelacionFamiliar: any
	catTipoPatrimonial: any
}

@Component({
	selector: 'app-addRelacion',
	templateUrl: './addRelacion.component.html',
	styleUrls: ['./addRelacion.component.scss']
})
export class AddRelacionComponent implements OnInit {
	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataPersona: any;
	relacionForm: FormGroup;
	allPersonasRelacionar: any;
	catRelacionFamiliar: any;
	catTipoPatrimonial: any;
	showPatrimonial: boolean = false;
	dataUsuario: any;

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<AddRelacionComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private gaService: GaService,
		private spinner: NgxSpinnerService
	) {
		this.titulo = data.title;
		this.dataPersona = data.dataPersona;
		this.catRelacionFamiliar = data.catRelacionFamiliar
		this.catTipoPatrimonial = data.catTipoPatrimonial
	};

	ngOnInit() {
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
		this.getAllPersonasRelacionar();
		let nombreCompleto = `${this.dataPersona.Nombre_RazonSocial} ${this.dataPersona.APaterno} ${this.dataPersona.AMaterno}`;
		this.relacionForm = this._formBuilder.group({
			nombrePersona: [nombreCompleto, Validators.required],
			familiar: [0, Validators.min(1)],
			tipoRelacion: [0, Validators.min(1)],
			patrimonial: [0],
		});
	};

	getAllPersonasRelacionar = () => {
		const data = {
			Opcion: 1,
			IdPersona: this.dataPersona.IdPersona
		};
		this.gaService.postService('personas/selAllRelacionesFamiliares', data).subscribe((res: any) => {
			this.allPersonasRelacionar = res[0];
		}, (error: any) => {
			Swal.fire({
				title: '¡Error!',
				text: error.error.text,
				icon: 'error',
				confirmButtonText: 'Cerrar'
			});
		});
	};

	changeTipoRelacion = e => {
		this.relacionForm.controls.patrimonial.setValue(0);
		if (e === 2) {
			this.relacionForm.controls.patrimonial.addValidators([Validators.min(1)]);
			this.relacionForm.controls.patrimonial.updateValueAndValidity();
			this.showPatrimonial = true;
		} else {
			this.relacionForm.controls.patrimonial.clearValidators();
			this.relacionForm.controls.patrimonial.updateValueAndValidity();
			this.showPatrimonial = false;
		};
	};

	guardarRelacion = () => {
		if (this.relacionForm.invalid) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Completa los campos obligatorios',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.relacionForm.markAllAsTouched();
			return;
		};

		Swal.fire({
			title: `¿Estas seguro de guardar la relación familiar?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Guardar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.spinner.show();
				const data = {
					Usuario: this.dataUsuario.IdUsuario,
					IdPersona: this.dataPersona.IdPersona,
					IdPersonaRelacion: this.relacionForm.controls.familiar.value,
					IdRelFamiliar: this.relacionForm.controls.tipoRelacion.value,
					IdTipoPatrimonial: this.relacionForm.controls.patrimonial.value === 0 ? null : this.relacionForm.controls.patrimonial.value
				};
				this.gaService.postService('personas/insRelacionesFamiliares', data).subscribe((res: any) => {
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

	closeDialog = data => {
		this.dialogRef.close(data);
	};

}
