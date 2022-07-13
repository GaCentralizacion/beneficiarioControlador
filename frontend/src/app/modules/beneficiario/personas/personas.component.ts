import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { GaService } from 'app/services/ga.service';
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
    selector: 'app-personas',
    templateUrl: './personas.component.html',
    styleUrls: ['./personas.component.scss']
})

export class PersonasComponent implements OnInit, OnDestroy {
    allPersonas: any;
    datosEvent: any = [];
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

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private gaService: GaService
    ) {

    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.getAllPersonas();
    };

    getAllPersonas = () => {
        this.gaService.getService('personas/allPersonas').subscribe((res: any) => {
            if (res[0].length > 0) {
                this.allPersonas = res[0];
                this.createGrid();
            } else {
                Swal.fire('Error al regresar las personas', '', 'warning')
            };
        });
    };

    createGrid = () => {
        this.toolbar = [];
        this.columns = [
            {
                caption: 'Nombre / Razon',
                dataField: 'nombre'
            },
            {
                caption: 'Alias',
                dataField: 'alias'
            },
            {
                caption: 'Tipo Persona',
                dataField: 'tipoPersona'
            },
            {
                caption: 'Es accionista',
                dataField: 'esAccionista'
            },
            {
                caption: 'Sexo',
                dataField: 'sexo'
            },
            {
                caption: 'Pais',
                dataField: 'pais'
            },
            {
                caption: 'Curp / Registro',
                dataField: 'curpRegistro'
            },
            {
                caption: 'Pais Fiscal',
                dataField: 'paisFiscal'
            },
            {
                caption: 'Identificacion',
                dataField: 'identificacion'
            },
            {
                caption: 'Estado Civil',
                dataField: 'estadoCivil'
            }
        ];
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
        this.muestraGrid = true;
    };

    datosMessage = e => {
        this.datosEvent = e.data;
    };

    receiveMessage($event) {
        try {
        } catch (error) {
            Swal.fire('Error inesperado', '', 'error')
        }
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
