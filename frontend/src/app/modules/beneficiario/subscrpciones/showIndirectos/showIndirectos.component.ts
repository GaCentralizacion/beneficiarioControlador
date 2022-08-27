import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { filter } from 'rxjs/operators';
import { filters } from '../../../../mock-api/apps/mailbox/data';

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
	dataAccionista: any;
	dataIndirecto: any;
}

@Component({
	selector: 'app-showIndirectos',
	templateUrl: './showIndirectos.component.html',
	styleUrls: ['./showIndirectos.component.scss']
})
export class ShowIndirectosComponent implements OnInit {
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
	muestraGrid: boolean = false;
	datosEvent: any = [];
	retornarValores = { success: 0, data: {} };
	titulo: string;
	dataAccionista: any
	dataIndirecto: any

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<ShowIndirectosComponent>,
		@Inject(MAT_DIALOG_DATA) public data: SendData,
		private gaService: GaService,
		private spinner: NgxSpinnerService
	) {
		this.titulo = data.title;
		this.dataAccionista = data.dataAccionista;
		this.dataIndirecto = data.dataIndirecto;
	};

	ngOnInit() {
		this.createGrid();
	};

	createGrid = () => {
		this.toolbar = [];
		this.columns = [
			{
				caption: 'Nombre',
				dataField: 'Nombre'
			},
			{
				caption: 'Razón social',
				dataField: 'RazonSocial'
			},
			{
				caption: 'Importe directo',
				dataType: TiposdeDato.number,
				format: TiposdeFormato.moneda,
				dataField: 'ImporteDirecto'
			},
			{
				caption: '% participación',
				dataField: 'Participacion'
			}
		]
		/*
			Parametros de Paginacion de Grit
			*/
		const pageSizes = ['10', '25', '50', '100'];

		/*
		Parametros de Exploracion
		*/
		this.exportExcel = { enabled: false, fileName: 'datos' };
		// ******************PARAMETROS DE COLUMNAS RESPONSIVAS EN CASO DE NO USAR HIDDING PRIORITY**************** */
		this.columnHiding = { hide: true };
		// ******************PARAMETROS DE PARA CHECKBOX**************** */
		this.Checkbox = { checkboxmode: 'none' };  // *desactivar con none*/
		// ******************PARAMETROS DE PARA EDITAR GRID**************** */
		this.Editing = { allowupdate: false }; // *cambiar a batch para editar varias celdas a la vez*/
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
		this.muestraGrid = true;
	};

};
