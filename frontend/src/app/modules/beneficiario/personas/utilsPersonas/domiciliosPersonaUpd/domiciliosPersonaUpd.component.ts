import { Component, OnInit, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'environments/environment';
import { DomiciliosModalComponent } from './domiciliosModal/domiciliosModal.component';

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

const REGEX_CP = /^[0-9]{5}$/;

@Component({
    selector: 'app-domiciliosPersonaUpd',
    templateUrl: './domiciliosPersonaUpd.component.html',
    styleUrls: ['./domiciliosPersonaUpd.component.scss']
})

export class DomiciliosPersonaUpdComponent implements OnInit, OnDestroy {
    /**INPUTUS OUTPUTS */
    @Input() gralDataPersona: any;
    @Input() catTipoDomicilio: any;
    /**INPUTUS OUTPUTS */

    /**Grid */
    allDomicilios: any;
    datosEvent: any = [];
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
    muestraGridDomicilios: boolean = false;
    /**Grid */

    userData: any

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private gaService: GaService,
        private spinner: NgxSpinnerService
    ) {

    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
        this.getDataDomiciliosPersona();
    };

    getDataDomiciliosPersona = () => {
        const data = {
            Opcion: 2,
            Usuario: this.userData.IdUsuario,
            IdPersona: this.gralDataPersona.IdPersona
        };
        this.gaService.postService('personas/selPersona', data).subscribe((res: any) => {
            if (res.length > 0) {
                this.allDomicilios = res[2];
                this.allDomicilios.forEach((value, key) => {
                    if ((key % 2) == 0) {
                        value.backgroundcolor = '#F4F6F6';
                    };
                });
                this.createGridDomicilios();
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

    AddDomicilios = () => {
        const dialogRef = this.dialog.open(DomiciliosModalComponent, {
            width: '100%',
            disableClose: true,
            data: {
                title: 'Agregar Domicilio',
                dataPersona: this.gralDataPersona,
                dataDomicilio: null,
                agregar: true,
                catTipoDomicilio: this.catTipoDomicilio
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se guardo ningun domicilio',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            } else {
                if (result.success === 1) {
                    this.getDataDomiciliosPersona();
                } else {
                    Swal.fire({
                        title: '¡Alto!',
                        text: 'Ocurrio un error al guardar el domicilio',
                        icon: 'warning',
                        confirmButtonText: 'Cerrar'
                    });
                };
            };
        });
    };

    actualizarDomicilio = e => {
        const dialogRef = this.dialog.open(DomiciliosModalComponent, {
            width: '100%',
            disableClose: true,
            data: {
                title: 'Agregar Domicilio',
                dataPersona: this.gralDataPersona,
                dataDomicilio: e.data,
                agregar: false,
                catTipoDomicilio: this.catTipoDomicilio
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se actualizo ningun domicilio',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            } else {
                if (result.success === 1) {
                    this.getDataDomiciliosPersona();
                } else {
                    Swal.fire({
                        title: '¡Alto!',
                        text: 'Ocurrio un erroe al actualizar el domicilio',
                        icon: 'warning',
                        confirmButtonText: 'Cerrar'
                    });
                };
            };
        });
    };

    eliminarDomicilio = e => {
        Swal.fire({
            title: `¿Estas seguro de eliminar el domicilio?`,
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Eliminar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                const data = {
                    IdDomicilio: e.data.IdDomicilio,
                    idTipDom: e.data.idTipDom,
                    esFiscal: e.data.esFiscal,
                    calle: e.data.calle,
                    numExt: e.data.numExt,
                    numInt: e.data.numInt,
                    cp: e.data.cp,
                    colonia_asentamiento: e.data.colonia_asentamiento,
                    delegacion_municipio: e.data.delegacion_municipio,
                    ciudad_estado: e.data.ciudad_estado,
                    pais: e.data.pais,
                    calle1: e.data.calle1,
                    calle2: e.data.calle2,
                    predeterminado: e.data.predeterminado,
                    Usuario: this.userData.IdUsuario,
                    Opcion: 2
                };

                this.gaService.postService('personas/updDomiciliosPersona', data).subscribe((res: any) => {
                    this.spinner.hide();
                    if (res[0][0].Codigo < 0) {
                        Swal.fire({
                            title: '¡Alto!',
                            text: res[0][0].Mensaje,
                            icon: 'warning',
                            confirmButtonText: 'Cerrar'
                        });
                    } else {
                        Swal.fire({
                            title: '¡Listo!',
                            text: res[0][0].Mensaje,
                            icon: 'success',
                            confirmButtonText: 'Cerrar'
                        });
                        this.getDataDomiciliosPersona();
                    };
                }, (error: any) => {
                    this.spinner.hide();
                    Swal.fire({
                        title: '¡Error!',
                        text: error.error.text,
                        icon: 'error',
                        confirmButtonText: 'Cerrar'
                    });
                });
            } else if (result.isDenied) {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se elimino el domicilio.',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            };
        });
    };

    createGridDomicilios = () => {
        this.muestraGridDomicilios = false;
        this.toolbar = [];
        this.columns = [
            {
                caption: 'Tipo de domicilio',
                dataField: 'TipoDomicilio'
            },
            {
                caption: 'Calle',
                dataField: 'calle'
            },
            {
                caption: '# exterior',
                dataField: 'numExt'
            },
            {
                caption: '# interior',
                dataField: 'numInt'
            },
            {
                caption: 'Colonia / Asentamiento',
                dataField: 'colonia_asentamiento'
            },
            {
                caption: 'Delegación / Municipio',
                dataField: 'delegacion_municipio'
            },
            {
                caption: 'Código postal',
                dataField: 'cp'
            },
            {
                caption: 'Predeterminado',
                allowEditing: false,
                cellTemplate: 'domiciliosPredeterminados'
            },
            {
                caption: 'Domicilio fiscal',
                allowEditing: false,
                cellTemplate: 'domicilioFiscal'
            },
            {
                caption: 'Editar',
                allowEditing: false,
                cellTemplate: 'actualizaDomicilio'
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
        this.muestraGridDomicilios = true;
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
