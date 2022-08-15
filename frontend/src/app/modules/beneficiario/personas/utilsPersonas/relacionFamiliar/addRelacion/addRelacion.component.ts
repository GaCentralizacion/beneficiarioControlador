import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'environments/environment';

/**
 * Obtenemos el Mensaje a mostrar
 */
export interface SendData {
	title: string;
}

@Component({
	selector: 'app-addRelacion',
	templateUrl: './addRelacion.component.html',
	styleUrls: ['./addRelacion.component.sass']
})
export class AddRelacionComponent implements OnInit {
	retornarValores = { id: 0, data: {} };
	titulo: string;

	constructor(
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<AddRelacionComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData
	) {
		this.titulo = data.title;
	}

	ngOnInit() {
	}

	guardarRelacion = () => {
		const dataRel = {
			id: 25,
			relacionado: "arturo",
			relacion: "Hijo"
		}
		this.retornarValores.id = 3;
		this.retornarValores.data = dataRel;
	}

}
