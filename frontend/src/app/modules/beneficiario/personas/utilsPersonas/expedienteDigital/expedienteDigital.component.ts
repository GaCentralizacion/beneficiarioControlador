import { Component, OnInit, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { promises, resolve } from 'dns';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { AddDocumentoComponent } from './addDocumento/addDocumento.component';

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
    selector: 'app-expedienteDigital',
    templateUrl: './expedienteDigital.component.html',
    styleUrls: ['./expedienteDigital.component.scss']
})

export class ExpedienteDigitalComponent implements OnInit, OnDestroy {
    /**INPUTUS OUTPUTS */
    @Input() gralDataPersona: any;
    /**INPUTUS OUTPUTS */

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

    allDocumentos: any = [];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private gaService: GaService
    ) { }

    ngOnDestroy(): void {
    };

    ngOnInit(): void {
        this.getAllDocuments();
    };

    getAllDocuments = () => {
        const data = {
            IdPersona: this.gralDataPersona.IdPersona
        };
        this.gaService.postService('personas/selDocumentosExpediente', data).subscribe((res: any) => {
            this.allDocumentos = res[0];
            this.createGrid();
        }, (error: any) => {
            Swal.fire({
                title: '¡Error!',
                text: 'Error 500 al regresar los documentos del usuario.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        })
    };

    verDocumentoExpDigCargado = data => {
        console.log('data', data)
    };

    addDocumento = () => {
        const dialogRef = this.dialog.open(AddDocumentoComponent, {
            width: '40%',
            disableClose: true,
            data: {
                title: 'Agregar documento',
                dataPersona: this.gralDataPersona,
                allDocumentos: this.allDocumentos
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se guardo el documento',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            } else {

            };
        });
    };

    createGrid = () => {
        this.muestraGrid = false;
        this.toolbar = [];
        this.columns = [
            {
                caption: 'Nombre documento',
                dataField: 'Documento'
            },
            {
                caption: 'Ver documento',
                allowEditing: false,
                cellTemplate: 'verDocumentoExpDig'
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

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
