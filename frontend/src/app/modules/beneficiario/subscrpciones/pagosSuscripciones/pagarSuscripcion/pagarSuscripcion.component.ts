import { Component, OnInit, Inject } from '@angular/core';
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
	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataPago: any
	dataUsuario: any;
	today = new Date();
	limitDay: any;
	pagarSuscripcionForm: FormGroup;
	focusTabs: number = 0;
	limitPago: number = 0;

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

	};

	ngOnInit() {
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
		this.limitDay = new Date(this.dataPago.FechaAdquisicion);
		this.limitPago = (this.dataPago.ImporteTotal - this.dataPago.Pagado);
		this.pagarSuscripcionForm = this._formBuilder.group({
			importePago: [0, [Validators.min(0.01), Validators.max(this.limitPago), Validators.required]],
			fechaPago: [null, Validators.required]
		});
	};

	onTabChanged = e => {
		if (e === 1) {
			this.titulo = 'Pagar suscripción';
			this.pagarSuscripcionForm.reset();
			this.pagarSuscripcionForm.controls.importePago.setValue(0);
		} else {
			this.titulo = 'Agregar dictamen';
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

	guardarDictamen = () => {
		console.log('PGuardar dictamen')
	};

	closeDialog = data => {
		this.dialogRef.close(data);
	};

}
