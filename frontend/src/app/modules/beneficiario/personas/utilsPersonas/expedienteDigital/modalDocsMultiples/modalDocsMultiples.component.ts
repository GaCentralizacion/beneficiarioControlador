import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';

export interface SendData {
	title: string;
	dataDocs: any;
    nombreDoc: any;
};

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
    selector: 'app-modalDocsMultiples',
    templateUrl: './modalDocsMultiples.component.html',
    styleUrls: ['./modalDocsMultiples.component.scss']
})

export class ModalDocsMultiplesComponent implements OnInit {

    titulo: string;
	dataDocs: any;
    nombreDoc: string;
    retornarValores = { success: 0, data: {} };

    /**Grid */
    allPersonas: any;
    datosEvent: any = [];
    muestraGrid: boolean = false;
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
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: SendData,
        public dialogRef: MatDialogRef<ModalDocsMultiplesComponent>,
    ) {
		this.dataDocs = data.dataDocs.filter(x => x.IdEstatusArchivo !== null);
        this.nombreDoc = data.nombreDoc;
        this.titulo = `${data.title} "${this.nombreDoc}"`;
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.dataDocs.forEach((value, key) => {
            if ((key % 2) == 0) {
                value.backgroundcolor = '#F4F6F6';
            };
        });
        this.createGrid();
    };

    createGrid = () => {
        this.muestraGrid = false;
        this.toolbar = [];
        this.columns = [
            {
                caption: 'Empresa',
                dataField: 'Nombre_RazonSocial'
            },
            {
                caption: 'Estatus',
                cellTemplate: 'estatusDocumento'
            },
            {
                caption: 'Editar',
                allowEditing: false,
                cellTemplate: 'editarDocumentoMultipeExpDig',
                width: 60
            },
            {
                caption: 'Ver',
                allowEditing: false,
                cellTemplate: 'verDocumentoMultipeExpDig',
                width: 60
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
        this.columnHiding = { hide: true };
        // ******************PARAMETROS DE PARA CHECKBOX**************** */
        this.Checkbox = { checkboxmode: 'none' };  // *desactivar con none multiple para seleccionar*/
        // ******************PARAMETROS DE PARA EDITAR GRID**************** */
        this.Editing = { allowupdate: false, mode: 'cell' }; // *cambiar a batch para editar varias celdas a la vez*/
        // ******************PARAMETROS DE PARA SELECCION DE COLUMNAS**************** */
        this.Columnchooser = { columnchooser: false };

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

    verDocumentoMultipleExpDigCargado = e =>{
        this.retornarValores.success = 1;
        this.retornarValores.data = e?.data;
        setTimeout(() => {
            this.closeDialog(this.retornarValores)
        }, 100);
    };

    editarDocumentoMultipleExpDigCargado = e =>{
        this.retornarValores.success = 2;
        this.retornarValores.data = e?.data;
        setTimeout(() => {
            this.closeDialog(this.retornarValores)
        }, 100);
    };

    closeDialog = data => {
		this.dialogRef.close(data);
	};
};
