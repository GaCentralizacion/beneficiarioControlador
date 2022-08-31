import { Component, OnInit, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { AddRelacionComponent } from './addRelacion/addRelacion.component';
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
import { environment } from 'environments/environment';
/**IMPORTS GRID */

@Component({
    selector: 'app-relacionFamiliar',
    templateUrl: './relacionFamiliar.component.html',
    styleUrls: ['./relacionFamiliar.component.scss']
})

export class RelacionFamiliarComponent implements OnInit, OnDestroy {
    @Input() gralDataPersona: any;
    @Input() catRelacionFamiliar: any
    @Input() catTipoPatrimonial: any

    /**Grid */
    allRelaciones: any;
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

    dataUsuario: any;
    accionesUsuario: any;
    nombrePersona: string = ''

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
        this.getAllRelacionesFamiliares();
        if (this.gralDataPersona.IdTipoPer === 1) {
            this.nombrePersona = `${this.gralDataPersona.Nombre_RazonSocial} ${this.gralDataPersona.APaterno} ${this.gralDataPersona.AMaterno}`;
        } else {
            this.nombrePersona = `${this.gralDataPersona.Nombre_RazonSocial}`;
        };
    };

    getAllRelacionesFamiliares = () => {
        this.allRelaciones = [];
        const data = {
            Opcion: 2,
            IdPersona: this.gralDataPersona.IdPersona
        };
        this.gaServise.postService('personas/selAllRelacionesFamiliares', data).subscribe((res: any) => {
            this.allRelaciones = res[0];
            this.allRelaciones.forEach((value, key) => {
                if ((key % 2) == 0) {
                    value.backgroundcolor = '#F4F6F6';
                };
            });
            this.createGrid();
        }, (error: any) => {
            Swal.fire({
                title: '¡Error!',
                text: error.error.text,
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        });
    };

    addRelacion = () => {
        const dialogRef = this.dialog.open(AddRelacionComponent, {
            width: '100%',
            disableClose: true,
            data: {
                title: 'Agregar relacion familiar',
                dataPersona: this.gralDataPersona,
                catRelacionFamiliar: this.catRelacionFamiliar,
                catTipoPatrimonial: this.catTipoPatrimonial
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se guardo la relación familiar',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            } else {
                if (result.success === 1) {
                    this.getAllRelacionesFamiliares();
                } else {
                    Swal.fire({
                        title: '¡Alto!',
                        text: 'Ocurrio un erro al guardar la relacion familiar',
                        icon: 'warning',
                        confirmButtonText: 'Cerrar'
                    });
                };
            };
        });
    };

    createGrid = () => {
        this.muestraGrid = false;
        this.toolbar = [];
        this.columns = [
            {
                caption: 'Nombre',
                dataField: 'Nombre'
            },
            {
                caption: 'Familiar',
                dataField: 'NombreFamiliar'
            },
            {
                caption: 'Relación',
                dataField: 'RelacionFamiliar'
            },
            {
                caption: 'Patrimonial',
                dataField: 'RelacionPatrimonial'
            },
            {
                caption: 'Eliminar',
                allowEditing: false,
                cellTemplate: 'eliminarRelacionFam'
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

    eliminarRelacionFamiliar = e => {
        Swal.fire({
            title: `¿Estas seguro de eliminar la relación familiar entre ${e.data.Nombre} y ${e.data.NombreFamiliar}?`,
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Eliminar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    Usuario: this.dataUsuario.IdUsuario,
                    IdPersonaRelFam: e.data.IdPersonaRelFam
                };
                this.gaServise.postService('personas/delRelacionesFamiliares', data).subscribe((res: any) => {
                    if (res[0][0].Codigo >= 1) {
                        Swal.fire({
                            title: '¡Listo!',
                            text: res[0][0].Mensaje,
                            icon: 'success',
                            confirmButtonText: 'Cerrar'
                        });
                        this.getAllRelacionesFamiliares();
                    } else {
                        Swal.fire({
                            title: '¡Alto!',
                            text: res[0][0].Mensaje,
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
                })
            } else if (result.isDenied) {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se elimino la relación familiar.',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            };
        });
    };

    datosMessage = e => {
        this.datosEvent = e.data;
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
