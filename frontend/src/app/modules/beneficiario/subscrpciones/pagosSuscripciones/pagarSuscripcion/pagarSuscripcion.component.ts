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
}

@Component({
	selector: 'app-pagarSuscripcion',
	templateUrl: './pagarSuscripcion.component.html',
	styleUrls: ['./pagarSuscripcion.component.scss']
})
export class PagarSuscripcionComponent implements OnInit {
	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataUsuario: any;

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<PagarSuscripcionComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private gaService: GaService,
		private spinner: NgxSpinnerService
	) {
		this.titulo = data.title;
	};

	ngOnInit() {
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
		console.log('Modal pago suscripcion')
	};

	pagarSuscripcion = () => {
		console.log('Pagar suscripcion')
	};

	guardarDictamen = () => {
		console.log('PGuardar dictamen')
	}

	closeDialog = data => {
		this.dialogRef.close(data);
	};

}
