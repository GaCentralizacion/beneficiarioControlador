import {
	Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2, ViewChild, AfterViewInit,
	TemplateRef, HostListener
} from '@angular/core';
import {
	IGridOptions, IColumns, IExportExcel, ISearchPanel, IScroll, Toolbar, IColumnHiding,
	ICheckbox, IEditing, IColumnchooser, IDetail, Color
} from '../../interfaces';
import { DxDataGridComponent } from 'devextreme-angular';
import { MatDialog } from '@angular/material/dialog';
import { isEmpty } from 'lodash';
import { environment } from 'environments/environment';
import 'devextreme/integration/jquery';

@Component({
	selector: 'app-grid-component',
	templateUrl: './grid-component.component.html',
	styleUrls: ['./grid-component.component.scss']
})
export class GridComponentComponent implements OnInit, AfterViewInit {

	@ViewChild('Gridlightbox') Gridlightbox: TemplateRef<any>;
	@ViewChild('grid') dataGrid: DxDataGridComponent;
	@ViewChild('griddetail') dataGriddetail: DxDataGridComponent;
	@ViewChild('grid', { read: ElementRef }) grid: ElementRef;
	@ViewChild('griddetail', { read: ElementRef }) griddetail: ElementRef;
	// ******************SE RECIBEN PARAMETROS Y SE ENVIA RESPUESTA**************** */
	@Input() datos: any[];
	@Input() datosdetail: [];
	@Input() Detail: IDetail;
	@Input() gridOptions: IGridOptions;
	@Input() columnHiding: IColumnHiding;
	@Input() Checkbox: ICheckbox;
	@Input() Editing: IEditing;
	@Input() CheckboxDetail: ICheckbox;
	@Input() Columnchooser: IColumnchooser;
	@Input() columns: IColumns[];
	@Input() columnsdetail: IColumns[];
	@Input() exportExcel: IExportExcel;
	@Input() searchPanel: ISearchPanel;
	@Input() scroll: IScroll;
	@Input() toolbar: Toolbar[];
	@Input() toolbardetail: Toolbar[];
	@Input() Color: Color;
	@Input() keyfather: string;
	@Input() keyfilter: string;
	@Input() keyDetalle: string;
	@Input() reglas: boolean;
	@Input() selectedRowKeys: any[];
	@Input() selectedRowKeysDetail: any[];
	@Input() KeyExprDetail: string;
	@Input() id: string;

	@Output() messageEvent = new EventEmitter<{ event: string, data: [] }>();
	remoteOperations: boolean;
	@Output() datosevent = new EventEmitter<{ data: [], event: any }>();
	@Output() datosdetailevent = new EventEmitter<{ data: [], event: any, datosPadre: any }>();
	@Output() editevent = new EventEmitter<any>();
	@Output() onInitialized = new EventEmitter<any>();
	@Output() onRowUpdated = new EventEmitter<any>();
	@Output() onRowInserted = new EventEmitter<any>();
	@Output() onRowRemoved = new EventEmitter<any>();
	@Output() onInitNewRow = new EventEmitter<any>();
	@Output() modificar = new EventEmitter<{ modificar }>();
	@Output() eliminar = new EventEmitter<{ eliminar }>();
	@Output() archivarCfdi = new EventEmitter<{ archivarCfdi }>();
	@Output() crudPersona = new EventEmitter<{ proceso, data }>();
	@Output() eliminarRelacionFamiliar = new EventEmitter<{ data }>();
	@Output() verSubscripciones = new EventEmitter<{ data }>();
	@Output() verDocumentoExpDigCargado = new EventEmitter<{ data }>();
	@Output() verParticipacionIdrecta = new EventEmitter<{ data }>();
	@Output() verDictamen = new EventEmitter<{ data }>();
	@Output() registrarPago = new EventEmitter<{ data }>();
	@Output() verPagos = new EventEmitter<{ data }>();

	public contador = 0;
	public contadordetail = 0;
	public toole;
	public tooledetail;
	documentos: [];
	DataSourceStorage: any;
	public newInnerWidth: number;
	justDeselected: any;
	accionesUsuario: any;

	constructor(private element: ElementRef, private renderer: Renderer2, public dialog: MatDialog) {
		this.DataSourceStorage = [];
	}

	ngAfterViewInit() {
		this.accionesUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.accionesUser));
		const div = this.grid.nativeElement.querySelector('.dx-datagrid-filter-panel');
		const parent = this.grid.nativeElement.querySelector('.dx-datagrid');
		const refChild = this.element.nativeElement.querySelector('.dx-datagrid-headers');
		this.renderer.insertBefore(parent, div, refChild);
	}

	// ******************PARAMETROS QUE SE AJUSTARAN SEGUN SE REAJUSTE LA RESOLUCION DEL DISPOSITIVO**************** */
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.newInnerWidth = event.target.innerWidth;
		if (this.newInnerWidth <= 768) {
			this.columnHiding = { hide: true };
			this.gridOptions = { paginacion: 10, pageSize: [10, 30, 50, 100] };
		} else if (this.newInnerWidth > 768) {
			this.columnHiding = { hide: false };
			if (this.gridOptions === undefined) {
				this.gridOptions = { paginacion: 50, pageSize: [50, 100, 300, 500] };
			}
		}
	}

	ngOnInit() {
		// //console.log(this.datos);

		this.datos.forEach((data: any, index) => {
			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					const element = data[key];
					if (key === this.keyDetalle) {
						this.datos[index].detalle = element;
						delete data[key];
					}
				}
			}
		});
		this.newInnerWidth = window.innerWidth;
		if (this.newInnerWidth <= 768) {
			this.columnHiding = { hide: true };
			this.gridOptions = { paginacion: 10, pageSize: [10, 30, 50, 100] };
		} else if (this.newInnerWidth > 768) {
			this.columnHiding = { hide: false };
			if (this.gridOptions === undefined) {
				this.gridOptions = { paginacion: 50, pageSize: [50, 100, 300, 500] };
			}
		}
		const idDocumentos = [];
		this.documentos = [];

		// ******************PARAMETROS DE EXPORTACION**************** */
		this.exportExcel = { enabled: true, fileName: 'Datos' };

		// ******************PARAMETROS DE PARA SELECCION DE COLUMNAS**************** */
		this.Columnchooser = { columnchooser: true };

		// ******************PARAMETROS DE SEARCH**************** */
		this.searchPanel = { visible: true, width: 250, placeholder: 'Buscar...', filterRow: true };

		// ******************PARAMETROS DE SCROLL**************** */
		this.scroll = { mode: 'standard' };

		// ******************PARAMETROS DE MAESTRO DETALLE**************** */
		if (this.Detail === undefined) {
			this.Detail = { detail: false };
		}

		// ******************PARAMETROS DE CONTROL DE COLORES**************** */
		if (this.Color === undefined) {
			this.Color = { filas: true, columnas: true, alternar: false };
		} else if (this.Color.color === 'gris') {
			this.Color = { filas: false, columnas: false, alternar: true, color: 'gris' };
		} else {
			this.Color = { filas: true, columnas: true, alternar: false };
		}
	}

	// ******************SE DEVUELVE EVENTO CLICK**************** */
	onclick(event, data) {
		this.messageEvent.emit({ event, data });
	}

	// ******************CONTADOR DE ITEMS SELECCINADOS Y DEVUELVE DATOS AL EMITER**************** */


	onSelectionChanged(e) {
		if (this.reglas) {
			e.component.collapseAll(-1);
			e.component.expandRow(e.currentSelectedRowKeys[0]);
		}
		const disabledKeys = e.currentSelectedRowKeys.filter(i => (i.disable));
		if (disabledKeys.length > 0) {
			if (this.justDeselected) {
				this.justDeselected = false;
				e.component.deselectAll();
			} else {
				this.justDeselected = true;
				e.component.deselectRows(disabledKeys);
			}
		}
		const data = e.selectedRowsData;
		this.datosevent.emit({ data, event: e });
		const cont = [];
		cont.push(e.selectedRowKeys);
		this.contador = cont[0].length;
		for (let i = 0; i < this.toole.toolbarOptions.items.length - 1; i++) {
			if (this.toole.toolbarOptions.items[i].factura) {
				if (this.toole.toolbarOptions.items[i].factura === 'factura') {
					if (cont[0].length >= 1) {
						this.toole.toolbarOptions.items[i].visible = true;
						this.toole.toolbarOptions.items[i].name = '';
					}
					if (cont[0].length <= 0) {
						this.toole.toolbarOptions.items[i].visible = false;
						this.toole.toolbarOptions.items[i].name = '';
					}
				}
				this.toole.toolbarOptions.items[i].name = '';
			} else {
				if (this.toole.toolbarOptions.items[i].name && !isEmpty(this.toole.toolbarOptions.items[i].factura)) {
					if (cont[0].length >= 1 && this.toole.toolbarOptions.items[i].name === 'simple') {
						this.toole.toolbarOptions.items[i].visible = true;
						if (cont[0].length >= 2 && this.toole.toolbarOptions.items[i].name2 === 'multiple') {
							this.toole.toolbarOptions.items[i].visible = false;
						}
					} else if (cont[0].length <= 0 && this.toole.toolbarOptions.items[i].name === 'simple') {
						this.toole.toolbarOptions.items[i].visible = false;
					}
				}
			}
		}
		this.dataGrid.instance.refresh();
	}

	Modificar(value) {
		this.modificar.emit({ modificar: value });
	}

	archivarCfdiFn = value => {
		this.archivarCfdi.emit({ archivarCfdi: value });
	};

	Eliminar(value) {
		this.eliminar.emit({ eliminar: value });
	}

	// ******************CONTADOR DE ITEMS SELECCINADOS Y DEVUELVE DATOS AL EMITER DE MAESTRO DETALLE**************** */
	onSelectionChangedDetail(e, datosPadre) {
		const disabledKeys = e.currentSelectedRowKeys.filter(i => (i.disable));
		if (disabledKeys.length > 0) {
			if (this.justDeselected) {
				this.justDeselected = false;
				e.component.deselectAll();
			} else {
				this.justDeselected = true;
				e.component.deselectRows(disabledKeys);
			}
		}
		const data = e.selectedRowsData;
		this.datosdetailevent.emit({ data, event: e, datosPadre });
		const dataGrid = e.component;
		const element = e.component._$element;
		const contadorHTML: Element = element[0];
		contadorHTML.getElementsByClassName('countcount')[0].innerHTML = dataGrid.getSelectedRowKeys().length;

		for (let i = 0; i < this.tooledetail.toolbarOptions.items.length - 1; i++) {
			if (this.tooledetail.toolbarOptions.items[i].name) {
				if (dataGrid.getSelectedRowKeys().length >= 1 && this.tooledetail.toolbarOptions.items[i].name === 'simple') {
					this.tooledetail.toolbarOptions.items[i].visible = true;

					if (dataGrid.getSelectedRowKeys().length >= 2 && this.tooledetail.toolbarOptions.items[i].name2 === 'multiple') {
						this.tooledetail.toolbarOptions.items[i].visible = false;

					}
				} else if (dataGrid.getSelectedRowKeys().length <= 0 && this.tooledetail.toolbarOptions.items[i].name === 'simple') {
					this.tooledetail.toolbarOptions.items[i].visible = false;
				}
			}
		}
		this.dataGriddetail.instance.refresh();
	}

	// ******************DEVUELVE LOS DATOS EDITADOS DEL GRID **************** */
	onRowUpdating(e) {
		const key = e.oldData;
		const newdata = e.newData;
		const editdata = {
			key,
			newData: newdata
		};
		this.editevent.emit({ editdata });
		this.dataGrid.instance.repaint();
	}

	// ******************DEVUELVE LOS DATOS EDITADOS DEL GRID MAESTRO DETALLE**************** */
	onRowUpdatingDetail(e) {
		const key = e.oldData;
		const newdata = e.newData;
		const editdata = {
			key,
			newData: newdata
		};
		this.editevent.emit({ editdata });
		this.dataGriddetail.instance.repaint();
	}

	// ******************CREACION DE TOOLBAR**************** */

	onToolbarPreparing(e) {
		this.toole = e;
		e.toolbarOptions.items.unshift({
			location: 'before',
			template: 'Totalderegistros'
		},
			{
				location: 'before',
				template: 'Contarseleccionados',
				visible: false,
				name: 'simple'
			},
			...this.toolbar
		);
	}

	// ******************CREACION DE TOOLBAR MAESTRO DETALLE**************** */

	onToolbarPreparingDetail(e) {
		this.tooledetail = e;

		e.toolbarOptions.items.unshift({
			location: 'before',
			template: 'Totalderegistrosdetail'
		},
			{
				location: 'before',
				template: 'Contarseleccionadosdetail'
			},
			...this.toolbardetail
		);
	}

	// ***************COLUMN CHOOSER EVENT****************** */
	onContentReady(e) {
		if (this.reglas) {
			if (!e.component.getSelectedRowKeys().length) {
				e.component.selectRowsByIndexes(0);
			}
		}
		this.datos.forEach((data: any, index) => {
			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					const element = data[key];
					if (key === this.keyDetalle) {
						this.datos[index].detalle = element;
						delete data[key];
					}
				}
			}
		});
		if (this.Color.color === 'gris') {
			const cont = this.grid.nativeElement.querySelector('.dx-header-row');
			this.renderer.setStyle(cont, 'background', 'transparent');
			this.renderer.setStyle(cont, 'font-weight', 'bold');
		}
	}

	// ***************COLUMN CHOOSER EVENT MAESTRO DETALLE****************** */
	onContentReadyDetail(e) {
		if (this.Color.color === 'gris') {
			const cont = this.griddetail.nativeElement.querySelector('.dx-header-row');
			this.renderer.setStyle(cont, 'background', 'transparent');
			this.renderer.setStyle(cont, 'font-weight', 'bold');
		}
	}

	onInitializedMaster($event) {
		this.onInitialized.emit(this.dataGrid);
	}

	onCellPrepared(e) {
		if (e.rowType === 'data' && e.column.command === 'select' && e.data.disable === true) {
			e.cellElement.find('.dx-select-checkbox').dxCheckBox('instance').option('disabled', true);
			e.cellElement.off();
		}
	}

	onCellPreparedDetail(e) {
		if (e.rowType === 'data' && e.column.command === 'select' && e.data.disable === true) {
			e.cellElement.find('.dx-select-checkbox').dxCheckBox('instance').option('disabled', true);
			e.cellElement.off();
		}
	}

	onRowPrepared(e) {
		if (e.rowType === 'data') {
			if (e.data.backgroundcolor) {
				e.rowElement.find('td').css('background', e.data.backgroundcolor);
			}
			if (e.data.color) {
				e.rowElement.find('td').css('color', e.data.color);
			}
		}
	}

	onRowPreparedDetail(e) {
		if (e.rowType === 'data') {
			if (e.data.backgroundcolor) {
				e.rowElement.find('td').css('background', e.data.backgroundcolor);
			}
		}
	}

	OnRowUpdated($event) {
		this.onRowUpdated.emit($event);
	}

	OnRowInserted($event) {
		this.onRowInserted.emit($event);
	}
	OnRowRemoved($event) {
		this.onRowRemoved.emit($event);
	}
	OnInitNewRow($event) {
		this.onInitNewRow.emit($event);
	}


	/**FUNCIONES DE LAS COLUMNAS */
	//PERONSAS
	seleccionaPersona = (proceso, data) => {
		this.crudPersona.emit({ proceso: proceso, data: data })
	};

	eliminarRelacion = data => {
		this.eliminarRelacionFamiliar.emit({ data: data });
	};

	verSubscripcionesFn = data => {
		this.verSubscripciones.emit({ data: data })
	};

	verDocumentoExpedienteDigital = data => {
		this.verDocumentoExpDigCargado.emit({ data: data });
	};

	verParticipacionIndirectaFn = data => {
		this.verParticipacionIdrecta.emit({ data: data });
	}

	verDictamenFn = data => {
		this.verDictamen.emit({ data: data })
	};

	registrarPagoFn = data => {
		this.registrarPago.emit({ data: data })
	};

	verPagosFn = data => {
		this.verPagos.emit({ data: data })
	};

	//PERONSAS
	/**FUNCIONES DE LAS COLUMNAS */
}
