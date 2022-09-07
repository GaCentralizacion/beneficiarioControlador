import { Component, OnInit, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { PagarSuscripcionComponent } from './pagarSuscripcion/pagarSuscripcion.component';
import { VerPagosComponent } from './verPagos/verPagos.component';

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
    selector: 'app-pagosSuscripciones',
    templateUrl: './pagosSuscripciones.component.html',
    styleUrls: ['./pagosSuscripciones.component.scss']
})

export class PagosSuscripcionesComponent implements OnInit, OnDestroy {
    @Input() dataCurrenteEmpresa: any
    /**Grid */
    pagos: any;
    datosEvent: any = [];
    muestraGridPago: boolean = false;
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

    dataUsuario: any;
    accionesUsuario: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private gaServise: GaService,
        private spinner: NgxSpinnerService
    ) {

    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.accionesUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.accionesUser));
        this.dataUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
        this.getDataPagos();
    };

    getDataPagos = () => {
        const data = {
            Opcion: 1,
            IdPersona: this.dataCurrenteEmpresa.IdPersona
        };
        this.gaServise.postService('suscripciones/selPagos', data).subscribe((res: any) => {
            this.pagos = res[0];
            this.pagos.forEach((value, key) => {
                if ((key % 2) == 0) {
                    value.backgroundcolor = '#F4F6F6';
                };
            });
            this.createGridPagos();
        }, (error: any) => {
            Swal.fire({
                title: '¡Error!',
                text: 'Error 500 al regresar los pagos',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        });
    };

    verDictamenFn = e => {
        console.log('verDictamenFn', e)
    };

    registrarPagoFn = e => {
        const dialogRef = this.dialog.open(PagarSuscripcionComponent, {
            width: '100%',
            disableClose: true,
            data: {
                title: 'Pagar suscripción',
                dataPago: e.data
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se realizó ninguna acción',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            } else {
                if (result.success === 1) {
                    this.getDataPagos();
                } else {
                    Swal.fire({
                        title: '¡Alto!',
                        text: 'Ocurrio un error al guardar la información',
                        icon: 'warning',
                        confirmButtonText: 'Cerrar'
                    });
                };
            };
        });
    };

    verPagosFn = e => {
        this.dialog.open(VerPagosComponent, {
            width: '100%',
            disableClose: true,
            data: {
                title: 'Pagos',
                dataPago: e.data,
                dataCurrenteEmpresa: this.dataCurrenteEmpresa
            }
        });
    };


    createGridPagos = () => {
        this.muestraGridPago = false;
        this.toolbar = [];
        this.columns = [
            {
                caption: 'Acreedor',
                dataField: 'Acreedor'
            },
            {
                caption: 'Deudor',
                dataField: 'Deudor'
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
                caption: 'Importe total',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.moneda,
                dataField: 'ImporteTotal'
            },
            {
                caption: 'Pagado',
                dataType: TiposdeDato.number,
                format: TiposdeFormato.moneda,
                dataField: 'Pagado'
            },
            {
                caption: 'Dictamen',
                dataField: 'Dictamen'
            },
            {
                caption: 'Ver dictamen',
                allowEditing: false,
                cellTemplate: 'verDictamen'
            },
            {
                caption: 'Fecha Adquisición',
                dataField: 'FechaAdquisicion'
            },
            {
                caption: 'Registrar',
                allowEditing: false,
                cellTemplate: 'registrarPago'
            },
            {
                caption: 'Ver pagos',
                allowEditing: false,
                cellTemplate: 'verPagos'
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
        this.muestraGridPago = true;
    };

    datosMessage = e => {
        this.datosEvent = e.data;
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
