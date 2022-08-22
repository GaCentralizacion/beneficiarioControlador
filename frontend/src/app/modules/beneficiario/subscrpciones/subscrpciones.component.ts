import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { AddSubscripcionesComponent } from './addSubscripciones/addSubscripciones.component';

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
import { environment } from 'environments/environment';
/**IMPORTS GRID */

@Component({
    selector: 'app-subscrpciones',
    templateUrl: './subscrpciones.component.html',
    styleUrls: ['./subscrpciones.component.scss']
})

export class SubscripcionesComponent implements OnInit, OnDestroy {
    accionesUsuario: any
    /**GRID */
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
    columnsAcciones: IColumns[];
    toolbarAcciones: Toolbar[];
    columnsSubscripciones = [];
    toolbarSubscripciones: Toolbar[];

    muestraGridAcciones: boolean = false;
    muestraGridSubscripciones: boolean = false;
    /**GRID */
    allEmpresas: any;
    dataCurrenteEmpresa: any;
    showInitialSubscripciones: boolean = true;
    allAcciones: any;
    allSubscripciones: any;

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
        this.accionesUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.accionesUser));
        this.getAllEmpresas();
    };

    getAllEmpresas = () => {
        this.spinner.show();
        const data = {
            Opcion: 1,
            IdPersona: null
        };
        this.gaService.postService('subscripciones/selAcciones', data).subscribe((res: any) => {
            this.spinner.hide();
            this.allEmpresas = res[0];
            this.createInitialGrid();
        }, (error: any) => {
            this.spinner.hide();
            Swal.fire({
                title: '¡Error!',
                text: error.error.text,
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        });
    };

    verSubscripciones = e => {
        if (e.data.IdPersona !== undefined || e.data.IdPersona !== null || e.data.IdPersona !== '') {
            this.dataCurrenteEmpresa = e.data;
            this.getAllTransaccionesByIdPersona(e.data);
        } else {
            Swal.fire({
                title: '¡Error!',
                text: 'Error al mostrar las suscripciones.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        };
    };

    getAllTransaccionesByIdPersona = dataPersona => {
        this.spinner.show();
        const data = {
            Opcion: 2,
            IdPersona: dataPersona.IdPersona
        };
        this.gaService.postService('subscripciones/selAcciones', data).subscribe((res: any) => {
            this.spinner.hide();
            this.allAcciones = res[0];
            this.allSubscripciones = res[1];
            this.createAccionesGrid();
            this.createSubscripcionesGrid();
            this.showInitialSubscripciones = false;
            this.muestraGrid = false;
        }, (error: any) => {
            this.spinner.hide();
            Swal.fire({
                title: '¡Error!',
                text: error.error.text,
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        });
    };

    registrarSubscripcion = () => {
        const dialogRef = this.dialog.open(AddSubscripcionesComponent, {
            width: '100%',
            disableClose: true,
            data: {
                title: 'Agregar suscripción',
                dataEmpresa: this.dataCurrenteEmpresa
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                this.getAllTransaccionesByIdPersona(this.dataCurrenteEmpresa);
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se guardo la suscripción',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            } else {
                if (result.success === 1) {
                    this.getAllTransaccionesByIdPersona(this.dataCurrenteEmpresa);
                } else {
                    Swal.fire({
                        title: '¡Alto!',
                        text: 'Ocurrio un erro al guardar la suscripción',
                        icon: 'warning',
                        confirmButtonText: 'Cerrar'
                    });
                };
            };
        });
    };

    onTabChanged = e => {
        if (e === 1) {
            this.createAccionesGrid();
        } else {
            this.createSubscripcionesGrid()
        };
    };

    createInitialGrid = () => {
        this.muestraGrid = false;
        this.toolbar = [];
        this.columns = [
            {
                caption: 'RFC',
                dataField: 'RFC'
            },
            {
                caption: 'Razón social',
                dataField: 'RazonSocial'
            },
            {
                caption: 'Acciones emitidas',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.numberMask,
                dataField: 'Acciones'
            },
            {
                caption: 'Acciones disponibles',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.numberMask,
                dataField: 'Disponibles'
            },
            {
                caption: 'Ver',
                allowEditing: false,
                cellTemplate: 'verSuscripciones'
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
        this.muestraGrid = true;
    };

    createAccionesGrid = () => {
        this.muestraGridAcciones = false;
        this.toolbarAcciones = [];
        this.columnsAcciones = [
            {
                caption: 'RFC',
                dataField: 'RFC'
            },
            {
                caption: 'Razón social',
                dataField: 'RazonSocial'
            },
            {
                caption: 'Moneda',
                dataField: 'Moneda'
            },
            {
                caption: 'Concepto',
                dataField: 'Concepto'
            },
            {
                caption: 'Serie',
                dataField: 'Serie'
            },
            {
                caption: 'Valor unitario',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.moneda,
                dataField: 'ValorUnitario'
            },
            {
                caption: 'Cantidad',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.numberMask,
                dataField: 'Cantidad'
            },
            {
                caption: 'Disponibles',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.numberMask,
                dataField: 'Disponibles'
            },
            {
                caption: 'Fecha emisión',
                dataField: 'FechaEmision'
            },
            {
                caption: 'Usuario alta',
                dataField: 'NombUsuarioAlta'
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
        this.muestraGridAcciones = true;
    };

    createSubscripcionesGrid = () => {
        this.muestraGridSubscripciones = false;
        this.toolbarSubscripciones = [];
        this.columnsSubscripciones = [
            {
                caption: 'Persona suscripción',
                dataField: 'PersonaSuscripcion',
            },
            {
                caption: 'Concepto',
                dataField: 'Concepto'
            },
            {
                caption: 'Persona destino',
                dataField: 'PersonaDestino'
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
                caption: 'Importe',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.moneda,
                dataField: 'Importe'
            },
            {
                caption: 'Fecha adquisición',
                dataField: 'FechaAduisicion'
            },
            {
                caption: 'Observaciones',
                dataField: 'Observaciones',
                cssClass: 'observaciones'
            },
            {
                caption: 'Precio unitario venta',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.moneda,
                dataField: 'PrecioUnitarioVenta'
            },
            {
                caption: 'Importe venta',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.moneda,
                dataField: 'ImporteVenta'
            },
            {
                caption: 'Dictamen',
                dataField: 'Dictamen'
            },
            {
                caption: 'Usuario alta',
                dataField: 'UsuarioAlta'
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
        this.muestraGridSubscripciones = true;
    };

    /**CLICK DE LOS BOTONES SUPERORPOR */
    receiveMessage($event) {
        try {
        } catch (error) {
            Swal.fire('Error inesperado', '', 'error')
        }
    };

    backAllEmpresas = () => {
        this.showInitialSubscripciones = true;
        this.muestraGrid = false;
        this.muestraGridSubscripciones = false;
        this.muestraGridAcciones = false;
        this.getAllEmpresas();
    };

    /**REGRESA LOS DATOS DE LOS ROWS SELECCIONADOS */
    datosMessage = e => {
        this.datosEvent = e.data;
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
