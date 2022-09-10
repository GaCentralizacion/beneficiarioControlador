import { Component, OnInit, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GaService } from 'app/services/ga.service';
import { environment } from 'environments/environment';
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

const VALID_REGEX_MAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
    selector: 'app-contactosPersonaUpd',
    templateUrl: './contactosPersonaUpd.component.html',
    styleUrls: ['./contactosPersonaUpd.component.scss']
})

export class ContactosPersonaUpdComponent implements OnInit, OnDestroy {
    /**INPUTUS OUTPUTS */
    @Input() gralDataPersona: any;
    /**INPUTUS OUTPUTS */

    userData: any;
    allContactos: any;

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
    muestraGridContactos: boolean = false;
    /**Grid */

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private gaService: GaService
    ) { }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
        this.getDataContactosPersona();
        console.log('ContactosPersonaUpdComponent WORKS', this.gralDataPersona)
    };

    getDataContactosPersona = () => {
        const data = {
            Opcion: 2,
            Usuario: this.userData.IdUsuario,
            IdPersona: this.gralDataPersona.IdPersona
        };
        this.gaService.postService('personas/selPersona', data).subscribe((res: any) => {
            if (res.length > 0) {
                this.allContactos = res[1];
                console.log('this.allContactos', this.allContactos)
                this.allContactos.forEach((value, key) => {
                    if ((key % 2) == 0) {
                        value.backgroundcolor = '#F4F6F6';
                    };
                });
                this.createGridContactos();
            } else {
                Swal.fire({
                    title: '¡Alto!',
                    text: 'Ocurrio un error al regresar los contactos de la persona',
                    icon: 'warning',
                    confirmButtonText: 'Cerrar'
                });
            };
        }, (error: any) => {
            Swal.fire({
                title: '¡Error!',
                text: 'Error 500 al regresar los contactos de la persona',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        });
    };

    createGridContactos = () => {
        this.muestraGridContactos = false;
        this.toolbar = [];
        this.columns = [
            {
                caption: 'Tipo de contacto',
                dataField: 'TipoContacto'
            },
            {
                caption: 'Dato',
                dataField: 'dato'
            },
            {
                caption: 'Extensión',
                dataField: 'ext'
            },
            {
                caption: 'Predeterminado',
                allowEditing: false,
                cellTemplate: 'contactosPredeterminados'
            }
        ];
        /*
            Parametros de Paginacion de Grit
            */

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
        this.muestraGridContactos = true;
    };
    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
