import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

/**IMPORTS GRID */
import {
	IGridOptions,
	IColumns,
	IExportExcel,
	ISearchPanel,
	IScroll,
	Toolbar,
	IColumnHiding,
	ICheckbox,
	IEditing,
	IColumnchooser,
	TiposdeDato,
	TiposdeFormato
} from 'app/interfaces';
/**IMPORTS GRID */

/**
 * Obtenemos el Mensaje a mostrar
 */
export interface SendData {
	title: string;
	dataPago: any;
	dataCurrenteEmpresa: any;
}

@Component({
	selector: 'app-verPagos',
	templateUrl: './verPagos.component.html',
	styleUrls: ['./verPagos.component.scss']
})
export class VerPagosComponent implements OnInit {
	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataPago: any
	dataUsuario: any;
	dataCurrenteEmpresa: any;
	allDataPagos: any;

	/**Grid */
	datosEvent: any = [];
	muestraGridPago: boolean = false;
	gridOptions: IGridOptions;
	columns = [];
	exportExcel: IExportExcel;
	searchPanel: ISearchPanel;
	scroll: IScroll;
	toolbar: Toolbar[];
	columnHiding: IColumnHiding;
	Checkbox: ICheckbox;
	Editing: IEditing;
	Columnchooser: IColumnchooser;
	/**Grid */

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<VerPagosComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private gaService: GaService,
		private spinner: NgxSpinnerService,
		private currency_pipe_object: CurrencyPipe
	) {
		this.dataPago = data.dataPago;
		this.dataCurrenteEmpresa = data.dataCurrenteEmpresa;
		this.titulo = `${data.title} de ${this.dataPago.Deudor} a ${this.dataPago.Acreedor}`;
	};

	ngOnInit() {
		this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
		this.getAllPagos();
	};

	getAllPagos = () => {
		this.spinner.show();
		const data = {
			Opcion: 2,
			IdPersona: this.dataCurrenteEmpresa.IdPersona,
			IdSubscripcion: this.dataPago.IdSubscripcion
		};
		this.gaService.postService('suscripciones/selPagosByIdSuscripcion', data).subscribe((res: any) => {
			this.spinner.hide();
			if (res[0].length > 0) {
				this.allDataPagos = res[0];
				this.allDataPagos.forEach((value, key) => {
					if ((key % 2) == 0) {
						value.backgroundcolor = '#F4F6F6';
					};
				});
				this.createGridPagos();
			} else {
				Swal.fire({
					title: '¡Información!',
					text: 'No se tienen pagos registrados',
					icon: 'info',
					confirmButtonText: 'Cerrar'
				});
				this.dialogRef.close();
			};

		}, (error: any) => {
			this.spinner.hide();
			Swal.fire({
				title: '¡Error!',
				text: 'Error 500 al regresar los pagos',
				icon: 'error',
				confirmButtonText: 'Cerrar'
			});
		});
	};

	createGridPagos = () => {
		this.muestraGridPago = false;
		this.toolbar = [];
		this.columns = [
			{
				caption: 'Concepto',
				dataField: 'Concepto'
			},
			{
				caption: 'Serie',
				dataField: 'Serie'
			},
			{
				caption: 'Cantidad',
				dataType: TiposdeDato.number,
				format: TiposdeFormato.numberMask,
				dataField: 'Cantidad'
			},
			{
				caption: 'Valor unitario',
				dataType: TiposdeDato.number,
				format: TiposdeFormato.moneda,
				dataField: 'ValorUnitario'
			},
			{
				caption: 'Importe total',
				dataType: TiposdeDato.number,
				format: TiposdeFormato.moneda,
				dataField: 'ImporteTotal'
			},
			{
				caption: 'Pagado',
				dataType: TiposdeDato.number,
				format: TiposdeFormato.moneda,
				dataField: 'Pagado'
			},
			{
				caption: 'Fecha pago',
				dataField: 'FechaPago'
			}
		];
		/*
			Parametros de Paginacion de Grit
			*/
		const pageSizes = ['10', '25', '50', '100'];

		this.gridOptions = { paginacion: 10, pageSize: [20, 40, 80, 100] };

		/*
		Parametros de Exploracion
		*/
		this.exportExcel = { enabled: true, fileName: 'datos' };
		// ******************PARAMETROS DE COLUMNAS RESPONSIVAS EN CASO DE NO USAR HIDDING PRIORITY**************** */
		this.columnHiding = { hide: false };
		// ******************PARAMETROS DE PARA CHECKBOX**************** */
		this.Checkbox = { checkboxmode: 'none' };  // *desactivar con none multiple para seleccionar*/
		// ******************PARAMETROS DE PARA EDITAR GRID**************** */
		this.Editing = { allowupdate: false, mode: 'cell' }; // *cambiar a batch para editar varias celdas a la vez*/
		// ******************PARAMETROS DE PARA SELECCION DE COLUMNAS**************** */
		this.Columnchooser = { columnchooser: true };

		/*
		Parametros de Search
		*/
		this.searchPanel = {
			visible: true,
			width: 200,
			placeholder: 'Buscar...',
			filterRow: true
		};

		/*
		Parametros de Scroll
		*/
		this.scroll = { mode: 'standard' };
		this.muestraGridPago = true;
	};

	closeDialog = data => {
		this.dialogRef.close(data);
	};

}
