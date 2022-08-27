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
import { ShowIndirectosComponent } from './showIndirectos/showIndirectos.component';
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
    muestraGridDashDirecto: boolean = false;
    columnsDashboardDirecto: any = [];
    toolbarDashboardDirecto: Toolbar[];

    muestraGridDashIndirecto: boolean = false;
    toolbarDashboardIndirecto: Toolbar[];
    columnsDashboardIndirecto: any = [];
    /**GRID */
    allEmpresas: any;
    dataCurrenteEmpresa: any;
    showInitialSubscripciones: boolean = true;
    allAcciones: any;
    allSubscripciones: any;
    focusTabs: number = 0;

    dashForm: FormGroup;
    headerDash: any;
    bodyDash: any;
    tituloAcciones: string;
    tituloImporte: string;
    dataAcciones: string;
    importeAcciones: string;
    showResumen: boolean = false;
    dataIndirectos: any;

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
        this.dashForm = this._formBuilder.group({
            tipoBusqueda: [1],
            directo: [true]
        });
        this.accionesUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.accionesUser));
        this.getAllEmpresas();
    };

    getAllEmpresas = () => {
        this.spinner.show();
        const data = {
            Opcion: 1,
            IdPersona: null
        };
        this.gaService.postService('suscripciones/selAcciones', data).subscribe((res: any) => {
            this.spinner.hide();
            this.allEmpresas = res[0];
            this.allEmpresas.forEach((value, key) => {
                if ((key % 2) == 0) {
                    value.backgroundcolor = '#D9E1F2';
                };
            });
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
        this.focusTabs = 0;
        if (e.data.IdPersona !== undefined || e.data.IdPersona !== null || e.data.IdPersona !== '') {
            this.dataCurrenteEmpresa = e.data;
            this.getAllTransaccionesDash();
        } else {
            Swal.fire({
                title: '¡Error!',
                text: 'Error al mostrar las suscripciones.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        };
    };

    getAllTransaccionesDash = () => {
        this.spinner.show();
        this.showResumen = false;
        this.showInitialSubscripciones = true;
        this.muestraGridDashDirecto = false;
        this.muestraGridDashIndirecto = false;
        if (this.dashForm.controls.tipoBusqueda.value === 1) {
            this.tituloAcciones = 'Acciones suscritas';
            this.tituloImporte = 'Importe suscrito';
        } else if (this.dashForm.controls.tipoBusqueda.value === 2) {
            this.tituloAcciones = 'Acciones pagadas';
            this.tituloImporte = 'Importe pagado';
        };

        const data = {
            Opcion: 2,
            IdPersona: this.dataCurrenteEmpresa.IdPersona,
            Tipo: this.dashForm.controls.tipoBusqueda.value,
            Participacion: this.dashForm.controls.directo.value ? 1 : 2
        };
        this.gaService.postService('suscripciones/selAcciones', data).subscribe((res: any) => {
            /**LLENADO DATOS DAHSBOARD */
            this.headerDash = res[2][0];
            this.bodyDash = res[3];
            this.bodyDash.forEach((value, key) => {
                if ((key % 2) == 0) {
                    value.backgroundcolor = '#D9E1F2';
                };
            });
            /**LLENADO DATOS ACCIONES */
            this.allAcciones = res[0];
            this.allAcciones.forEach((value, key) => {
                if ((key % 2) == 0) {
                    value.backgroundcolor = '#D9E1F2';
                };
            });
            /**LLENADO DATOS SUCRIPCIONES */
            this.allSubscripciones = res[1];
            this.allSubscripciones.forEach((value, key) => {
                if ((key % 2) == 0) {
                    value.backgroundcolor = '#D9E1F2';
                };
            });

            if (this.dashForm.controls.directo.value) {
                this.dataIndirectos = [];
                this.createDashboardDirectos();
            } else {
                this.dataIndirectos = res[4];
                this.dataIndirectos.forEach((value, key) => {
                    if ((key % 2) == 0) {
                        value.backgroundcolor = '#D9E1F2';
                    };
                });
                this.createDashboardIndirectos();
            };
            this.createAccionesGrid();
            this.createSubscripcionesGrid();
            this.showResumen = true;
            this.showInitialSubscripciones = false;
            this.spinner.hide();
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

    tipoDashFn = e => {
        this.muestraGridDashDirecto = false;
        this.muestraGridDashIndirecto = false;
        this.getAllTransaccionesDash();
    };

    verParticipacionIdrecta = data => {
        const dataSuscriptor = this.dataIndirectos.filter(x => x.IdPersonaSubscripcion === data.data.IdPersonaSubscripcion);
        if (dataSuscriptor.length === 0) {
            Swal.fire({
                title: '¡Información!',
                text: `${data.data.Nombre} no cuenta con participacion indirecta`,
                icon: 'info',
                confirmButtonText: 'Cerrar'
            });
            return
        };

        const dialogRef = this.dialog.open(ShowIndirectosComponent, {
            width: '100%',
            disableClose: true,
            data: {
                title: `Participaciones indirectas ${data.data.Nombre}`,
                dataAccionista: data.data,
                dataIndirecto: dataSuscriptor
            }
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
                this.getAllTransaccionesDash();
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se guardo la suscripción',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            } else {
                if (result.success === 1) {
                    this.getAllTransaccionesDash();
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
        if (e === 0) {
            this.dashForm.controls.tipoBusqueda.setValue(1);
            this.dashForm.controls.directo.setValue(true);
            this.getAllTransaccionesDash();
        } else if (e === 1) {
            this.createAccionesGrid();
        } else if (e === 2) {
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
                caption: 'Capital fijo',
                dataField: 'CapitalFijo'
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

    createDashboardDirectos = () => {
        this.muestraGridDashDirecto = false;
        this.toolbarDashboardDirecto = [];
        this.columnsDashboardDirecto = [
            {
                caption: 'Nombre',
                dataField: 'Nombre'
            },
            {
                caption: 'Importe directo',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.moneda,
                dataField: 'ImporteDirecto',
                cssClass: 'directo'
            },
            {
                caption: '% participación directa',
                dataType: TiposdeDato.number,
                dataField: 'ParticipacionDirecto',
                cssClass: 'directo'
            }
        ];
        /*
            Parametros de Paginacion de Grit
            */
        const pageSizes = ['10', '25', '50', '100'];

        this.gridOptions = { paginacion: 100, pageSize: [20, 40, 80, 100] };

        /*
        Parametros de Exploracion
        */
        this.exportExcel = { enabled: true, fileName: 'accionistasDirectos' };
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
        this.muestraGridDashDirecto = true;
    };

    createDashboardIndirectos = () => {
        this.muestraGridDashIndirecto = false;
        this.toolbarDashboardIndirecto = [];
        this.columnsDashboardIndirecto = [
            {
                caption: 'Nombre',
                dataField: 'Nombre'
            },
            {
                caption: 'Importe directo',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.moneda,
                dataField: 'ImporteDirecto',
                cssClass: 'directo'
            },
            {
                caption: '% participación directa',
                dataType: TiposdeDato.number,
                dataField: 'ParticipacionDirecto',
                cssClass: 'directo'
            },
            {
                caption: '',
                dataField: ''
            },
            {
                caption: '% participación indirecta',
                dataField: 'ParticipacionIndirecto',
                cssClass: 'indirecto'
            },
            {
                caption: '% participación total',
                dataField: 'ParticipacionTotal',
                cssClass: 'indirecto'
            },
            {
                caption: 'Participación indirecta',
                allowEditing: false,
                cellTemplate: 'verParticipacionIndirecta',
                cssClass: 'indirecto'
            }
        ];
        /*
            Parametros de Paginacion de Grit
            */
        const pageSizes = ['10', '25', '50', '100'];

        this.gridOptions = { paginacion: 100, pageSize: [20, 40, 80, 100] };

        /*
        Parametros de Exploracion
        */
        this.exportExcel = { enabled: true, fileName: 'accionistasIndirectos' };
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
        this.muestraGridDashIndirecto = true;
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
        this.muestraGridDashDirecto = false;
        this.muestraGridDashIndirecto = false;
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
