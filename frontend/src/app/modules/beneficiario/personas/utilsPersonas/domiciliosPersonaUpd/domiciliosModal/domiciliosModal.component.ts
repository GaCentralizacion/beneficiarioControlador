import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

const REGEX_CP = /^[0-9]{5}$/;

export interface SendData {
	title: string;
	dataPersona: any;
	dataDomicilio: any;
	agregar: boolean;
	catTipoDomicilio: any;
}

@Component({
	selector: 'app-domiciliosModal',
	templateUrl: './domiciliosModal.component.html',
	styleUrls: ['./domiciliosModal.component.scss']
})
export class DomiciliosModalComponent implements OnInit {
	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataPersona: any;
	domiciliosForm: FormGroup;
	dataUsuario: any;
	dataDomicilio: any;
	agregar: boolean;
	catTipoDomicilio: any;
	//VARIABLE PARA LA VALIDACION DEL CODIGO POSTAL
	searchCodigoPostal: boolean = true;

	/**VARIABLES AUTOCOMPLETE */
	optionsColonia: string[] = [];
	optionsDelegacion: string[] = [];
	optionsCiudad: string[] = [];
	optionsPais: string[] = [];
	/**VARIABLES AUTOCOMPLETE */

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<DomiciliosModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private gaService: GaService,
		private spinner: NgxSpinnerService
	) {
		this.titulo = data.title;
		this.dataPersona = data.dataPersona;
		this.dataDomicilio = data.dataDomicilio;
		this.agregar = data.agregar;
		this.catTipoDomicilio = data.catTipoDomicilio;
	};

	ngOnInit() {
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
		if (this.agregar) {
			this.domiciliosForm = this._formBuilder.group({
				idTipDom: [0, Validators.min(1)],
				esFiscal: false,
				calle: ['', Validators.required],
				numExt: ['', Validators.required],
				numInt: [''],
				cp: ['', (Validators.required, Validators.pattern(REGEX_CP))],
				colonia_asentamiento: ['', Validators.required],
				delegacion_municipio: ['', Validators.required],
				ciudad_estado: ['', Validators.required],
				pais: ['', Validators.required],
				calle1: [''],
				calle2: [''],
				predeterminado: false
			});
		} else {
			this.searchCodigoPostal = false;
		};
	};

	changeCodigoPostal = e => {
		if (e.match(REGEX_CP)) {
			this.spinner.show();
			const data = {
				CodigoPostal: e
			}
			this.gaService.postService('personas/selDataSepoMex', data).subscribe((res: any) => {
				this.domiciliosForm.controls.colonia_asentamiento.setValue('');
				this.domiciliosForm.controls.delegacion_municipio.setValue('');
				this.domiciliosForm.controls.ciudad_estado.setValue('');
				this.domiciliosForm.controls.pais.setValue('');
				this.optionsColonia = [];
				this.optionsDelegacion = [];
				this.optionsCiudad = [];
				this.optionsPais = [];
				if (res[0].length > 0) {
					for (let data of res[0]) {
						if (this.optionsColonia.indexOf(data.Colonia_Asentamiento) === -1) {
							this.optionsColonia.push(data.Colonia_Asentamiento);
						};
						if (this.optionsDelegacion.indexOf(data.Delegacion_Municipio) === -1) {
							this.optionsDelegacion.push(data.Delegacion_Municipio);
						};
						if (this.optionsCiudad.indexOf(data.Ciudad_Estado) === -1) {
							this.optionsCiudad.push(data.Ciudad_Estado);
						};
						if (this.optionsPais.indexOf(data.Pais) === -1) {
							this.optionsPais.push(data.Pais);
						};
					};
				} else {
					this.optionsColonia = [];
					this.optionsDelegacion = [];
					this.optionsCiudad = [];
				};
				this.searchCodigoPostal = false;
				this.spinner.hide();
			}, (error: any) => {
				this.spinner.hide();
				Swal.fire({
					title: '¡Error!',
					text: 'Error al traer informacion de SepoMex, ' + error.error.text,
					icon: 'error',
					confirmButtonText: 'Cerrar'
				});
			});
		} else {
			this.searchCodigoPostal = true;
		};
	};

	guardarDomicilio = () => {
		if (this.domiciliosForm.invalid) {
			Swal.fire({
				title: '¡Alto!',
				text: 'Completa los campos obligatorios',
				icon: 'warning',
				confirmButtonText: 'Cerrar'
			});
			this.domiciliosForm.markAllAsTouched();
			return;
		};

		Swal.fire({
			title: `¿Estas seguro de guardar el domicilio?`,
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Guardar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.spinner.show();
				const data = {
					IdPersona: this.dataPersona.IdPersona,
					idTipDom: this.domiciliosForm.controls.idTipDom.value,
					esFiscal: this.domiciliosForm.controls.esFiscal.value,
					calle: this.domiciliosForm.controls.calle.value,
					numExt: this.domiciliosForm.controls.numExt.value,
					numInt: this.domiciliosForm.controls.numInt.value,
					cp: this.domiciliosForm.controls.cp.value,
					colonia_asentamiento: this.domiciliosForm.controls.colonia_asentamiento.value,
					delegacion_municipio: this.domiciliosForm.controls.delegacion_municipio.value,
					ciudad_estado: this.domiciliosForm.controls.ciudad_estado.value,
					pais: this.domiciliosForm.controls.pais.value,
					calle1: this.domiciliosForm.controls.calle1.value,
					calle2: this.domiciliosForm.controls.calle2.value,
					predeterminado: this.domiciliosForm.controls.predeterminado.value,
					Usuario: this.dataUsuario.IdUsuario
				};

				this.gaService.postService('personas/insDomiciliosPersona', data).subscribe((res: any) => {
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
					text: 'No se guardo guardo el domicilio.',
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
