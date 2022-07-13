import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
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

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
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
            clave: '01',
            usuario: 'Luis Garcia'
        },
        {
            clave: '02',
            usuario: 'Luis Perrusquia'
        }
    ];
    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder
    ) {

    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
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
                    text: 'Descargar Facturas',
                    onClick: this.prueba.bind(this, 'pdf')
                },
                visible: false,
                factura: 'factura'
            }
        );
        this.scroll = { mode: 'standard' };
        this.toolbar.push(
            {
                location: 'after',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    width: 200,
                    text: 'Descargar XML',
                    onClick: this.prueba.bind(this, 'XML')
                },
                visible: false,
                factura: 'factura'
            }
        );
        this.scroll = { mode: 'standard' };
        this.toolbar.push(
            {
                location: 'after',
                widget: 'dxButton',
                locateInMenu: 'auto',
                options: {
                    width: 200,
                    text: 'Enviar por correo',
                    onClick: this.prueba.bind(this, 'sendmail')
                },
                visible: false,
                factura: 'factura'
            }
        );
        this.muestraGrid = true;
    };

    prueba = e => {
        console.log('e', e)
    }

    prueba1 = () => {
        console.log('Prueba1')
    };

    datosMessage = e => {
        console.log('e', e)
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
