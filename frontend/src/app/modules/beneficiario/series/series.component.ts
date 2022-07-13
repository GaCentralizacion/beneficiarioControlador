import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import Swal from 'sweetalert2';
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

@Component({
	selector: 'app-series',
	templateUrl: './series.component.html',
	styleUrls: ['./series.component.scss']
})

export class SeriesComponent implements OnInit, OnDestroy {
	/**
	 * VARIABLES PARA EL GRID
	 */

	muestraGrid: boolean = false;
	gridOptions: IGridOptions;
	columns: IColumns[];
	exportExcel: IExportExcel;
	searchPanel: ISearchPanel;
	scroll: IScroll;
	toolbar: Toolbar[];
	columnHiding: IColumnHiding;
	Checkbox: ICheckbox;
	Editing: IEditing;
	Columnchooser: IColumnchooser;
	dataPrueba: any = [
		{
			clave: '1',
			usuario: 'Serie A'
		},
		{
			clave: '2',
			usuario: 'Serie B'
		}
	];
	/**
	 * VARIABLES PARA EL GRID
	 */

	datosEvent: any = [];
	constructor(
		private fb: FormBuilder,
		private router: Router,
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		private spinner: NgxSpinnerService
	) {

	}

	ngOnDestroy(): void {
	}

	ngOnInit(): void {
		console.log('COMPONENTE SERIES WORKS!')
		this.createGrid();
	};

	createGrid = () => {
		this.toolbar = [];
		this.columns = [
			{
				caption: 'Clave',
				dataField: 'clave'
			},
			{
				caption: 'Usuario',
				dataField: 'usuario'
			},
		]
		/*
			Parametros de Paginacion de Grit
			*/
		const pageSizes = ['10', '25', '50', '100'];

		/*
		Parametros de Exploracion
		*/
		this.exportExcel = { enabled: false, fileName: 'Prueba' };
		// ******************PARAMETROS DE COLUMNAS RESPONSIVAS EN CASO DE NO USAR HIDDING PRIORITY**************** */
		this.columnHiding = { hide: true };
		// ******************PARAMETROS DE PARA CHECKBOX**************** */
		this.Checkbox = { checkboxmode: 'multiple' };  // *desactivar con none*/
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
		this.toolbar.push(
			{
				location: 'after',
				widget: 'dxButton',
				locateInMenu: 'auto',
				options: {
					width: 200,
					text: 'Click',
					onClick: this.prueba.bind(this, 'Se hizo clik')
				},
				visible: false,
				factura: 'factura'
			}
		);
		this.muestraGrid = true;
	};

	prueba = e => {
		Swal.fire({
			title: '¿Quieres guardar los cambios?',
			showDenyButton: true,
			// showCancelButton: true,
			confirmButtonText: 'Guardar',
			denyButtonText: `Cancelar`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.spinner.show();
				console.log('datosEvent', this.datosEvent)
				setTimeout(() => {
					this.spinner.hide();
					Swal.fire('Se guardo la informacion con éxito', '', 'success')
				}, 2000);

			} else if (result.isDenied) {
				Swal.fire('No se guardo la informacion', '', 'info')
			}
		})
	};

	datosMessage = e => {
		this.datosEvent = e.data;
	};

	redirect(url: string) {
		this.router.navigateByUrl(url);
	};
};
