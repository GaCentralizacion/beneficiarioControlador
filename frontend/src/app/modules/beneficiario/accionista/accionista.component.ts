import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';

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
    selector: 'app-accionista',
    templateUrl: './accionista.component.html',
    styleUrls: ['./accionista.component.scss']
})

export class AccionistaComponent implements OnInit, OnDestroy {
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
    muestraGrid: boolean = false;
    dataAccionistas: any;
    datosEvent: any = [];

    constructor(
        private gaService: GaService,
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
        this.getAllUsuarios();
    };

    spinnerFn = () => {
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 2000);
    };

    getAllUsuarios = () => {
        this.spinner.show();
        this.gaService.getService(`accionistas/selAllAccionistas`).subscribe((res: any) => {
            this.spinner.hide();
            if (res[0][0].success === 1) {
                this.dataAccionistas = res[1];
                this.createGrid();
            } else {
                Swal.fire({
                    title: '¡Alto!',
                    text: 'No se encontraton accionistas',
                    icon: 'warning',
                    confirmButtonText: 'Cerrar'
                });
            };
        }, (error: any) => {
            Swal.fire({
                title: '¡Error!',
                text: error.error.text,
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        });
    };

    getUsuariosById = idUsuario => {
        this.spinner.show();
        this.gaService.getService(`accionistas/selAccionistaByid?idUsuario=${idUsuario}`).subscribe((res: any) => {
            this.spinner.hide();
        }, (error: any) => {
            Swal.fire({
                title: '¡Error!',
                text: error.error.text,
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        });
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };

    createGrid = () => {
        this.toolbar = [];
        this.columns = [
            {
                caption: 'ID USUARIO',
                dataField: 'idUsuario'
            },
            {
                caption: 'User Name',
                dataField: 'userName'
            },
            {
                caption: 'Password',
                dataField: 'pass'
            },
            {
                caption: 'Nombre',
                dataField: 'nombre'
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
        // this.toolbar.push(
        // 	{
        // 		location: 'after',
        // 		widget: 'dxButton',
        // 		locateInMenu: 'auto',
        // 		options: {
        // 			width: 200,
        // 			text: 'Click',
        // 			onClick: this.prueba.bind(this, 'Se hizo clik')
        // 		},
        // 		visible: false,
        // 		factura: 'factura'
        // 	}
        // );
        this.muestraGrid = true;
    };

    datosMessage = e => {
        this.datosEvent = e.data;
    };
};
