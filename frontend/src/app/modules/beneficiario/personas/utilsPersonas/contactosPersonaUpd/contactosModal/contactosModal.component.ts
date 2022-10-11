import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

const VALID_REGEX_MAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const VALID_REGEX_NUMBER = /^[0-9]{10}$/;
/**
 * Obtenemos el Mensaje a mostrar
 */
export interface SendData {
	title: string;
	dataPersona: any;
	dataContacto: any;
	agregar: boolean;
	catTipoContacto: any;
}

@Component({
	selector: 'app-contactosModal',
	templateUrl: './contactosModal.component.html',
	styleUrls: ['./contactosModal.component.scss']
})
export class ContactosModalComponent implements OnInit {
	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataPersona: any;
	contactoForm: FormGroup;
	dataUsuario: any;
	dataContacto: any;
	agregar: boolean;
	catTipoContacto: any;
	datoPlaceHolder: string = '';
	datoType: string = 'text'

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<ContactosModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private gaService: GaService,
		private spinner: NgxSpinnerService
	) {
		this.titulo = data.title;
		this.dataPersona = data.dataPersona;
		this.dataContacto = data.dataContacto;
		this.agregar = data.agregar;
		this.catTipoContacto = data.catTipoContacto;
	};

	ngOnInit() {
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
		if (this.agregar) {
			this.contactoForm = this._formBuilder.group({
				idTipCont: [0, Validators.min(1)],
				dato: ['', Validators.required],
				predeterminado: false,
				ext: '',
				personaContactar: ''
			});
		} else {
			this.contactoForm = this._formBuilder.group({
				idTipCont: [this.dataContacto.idTipCont, Validators.min(1)],
				dato: [this.dataContacto.dato, Validators.required],
				predeterminado: this.dataContacto.predeterminado,
				personaContactar: this.dataContacto.personaContactar,
				ext: this.dataContacto.ext
			});
			this.selectContactoIntial(this.dataContacto.idTipCont);
		};
	};

	selectContactoIntial = e => {
		if (e === 2) {
			this.contactoForm.controls.dato.addValidators(Validators.pattern(VALID_REGEX_MAIL));
			this.contactoForm.controls.dato.updateValueAndValidity();
		} else {
			this.contactoForm.controls.dato.addValidators([Validators.required, Validators.pattern(VALID_REGEX_NUMBER)]);
			this.contactoForm.controls.dato.updateValueAndValidity();
		};
	};

	selectContacto = e => {
		this.contactoForm.controls.dato.setValue('');
		this.contactoForm.controls.dato.clearValidators();
		this.contactoForm.controls.dato.updateValueAndValidity();
		this.datoPlaceHolder = '';
		if (e === 2) {
			this.datoType = 'text';
			this.datoPlaceHolder = 'Email';
			this.contactoForm.controls.dato.addValidators(Validators.pattern(VALID_REGEX_MAIL));
			this.contactoForm.controls.dato.updateValueAndValidity();
		} else {
			this.datoType = 'number';
			this.datoPlaceHolder = 'Número';
			this.contactoForm.controls.dato.addValidators([Validators.required, Validators.pattern(VALID_REGEX_NUMBER)]);
			this.contactoForm.controls.dato.updateValueAndValidity();
		};
	};

	guardarContacto = () => {
		if (this.contactoForm.invalid) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Completa los campos obligatorios',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.contactoForm.markAllAsTouched();
			return;
		};

		Swal.fire({
			title: `¿Estas seguro de guardar el contacto?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Guardar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.spinner.show();
				const data = {
					IdPersona: this.dataPersona.IdPersona,
					IdTipoContacto: this.contactoForm.controls.idTipCont.value,
					Dato: this.contactoForm.controls.dato.value,
					Predeterminado: this.contactoForm.controls.predeterminado.value,
					Ext: this.contactoForm.controls.ext.value,
					PersonaContacto: this.contactoForm.controls.personaContactar.value,
					Usuario: this.dataUsuario.IdUsuario
				};
				console.log('data', data)
				this.gaService.postService('personas/insContactoPersona', data).subscribe((res: any) => {
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
					text: 'No se guardo guardo el contacto.',
					icon: 'info',
					confirmButtonText: 'Cerrar'
				});
			};
		});
	};

	actualizarContacto = () => {
		if (this.contactoForm.invalid) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Completa los campos obligatorios',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.contactoForm.markAllAsTouched();
			return;
		};
		Swal.fire({
			title: `¿Estas seguro de actualizar el contacto?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Actualizar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.spinner.show();
				const data = {
					IdContacto: this.dataContacto.IdContacto,
					IdTipoContacto: this.contactoForm.controls.idTipCont.value,
					Dato: this.contactoForm.controls.dato.value,
					Predeterminado: this.contactoForm.controls.predeterminado.value,
					Ext: this.contactoForm.controls.ext.value,
					PersonaContacto: this.contactoForm.controls.personaContactar.value,
					Usuario: this.dataUsuario.IdUsuario,
					Opcion: 1
				};

				this.gaService.postService('personas/updContactoPersona', data).subscribe((res: any) => {
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
					text: 'No se actualizo el contacto.',
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
