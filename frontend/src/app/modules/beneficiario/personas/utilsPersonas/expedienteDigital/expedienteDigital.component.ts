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
import { ShowDocumentoComponent } from './showDocumento/showDocumento.component';
import { NgxSpinnerService } from "ngx-spinner";
import { ModalDocsMultiplesComponent } from './modalDocsMultiples/modalDocsMultiples.component';
import { ShowMultipleDocumentoComponent } from './showMultipleDocumento/showMultipleDocumento.component';
import { UpdateMultipleDocumentoComponent } from './updateMultipleDocumento/updateMultipleDocumento.component';

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
    accionesUsuario: any;
    nombrePersona: string = ''
    dataDocsMultiples: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private gaService: GaService,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnDestroy(): void {
    };

    ngOnInit(): void {
        this.accionesUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.accionesUser));
        this.getAllDocuments();
        if (this.gralDataPersona.IdTipoPer === 1) {
            this.nombrePersona = `${this.gralDataPersona.Nombre_RazonSocial} ${this.gralDataPersona.APaterno} ${this.gralDataPersona.AMaterno}`;
        } else {
            this.nombrePersona = `${this.gralDataPersona.Nombre_RazonSocial}`;
        };
    };

    getAllDocuments = () => {
        const data = {
            IdPersona: this.gralDataPersona.IdPersona
        };
        this.gaService.postService('personas/selDocumentosExpediente', data).subscribe((res: any) => {
            this.allDocumentos = res[0];
            this.allDocumentos.forEach((value, key) => {
                if ((key % 2) == 0) {
                    value.backgroundcolor = '#F4F6F6';
                };
            });
            this.createGrid();
        }, (error: any) => {
            Swal.fire({
                title: '¡Error!',
                text: 'Error 500 al regresar los documentos del accionista.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        })
    };

    verDocumentoExpDigCargado = data => {
        if(data.data.Multiple === 0){
            const dialogRef = this.dialog.open(ShowDocumentoComponent, {
                width: '100%',
                height: '95%',
                disableClose: true,
                data: {
                    title: data.data.Documento,
                    urlGet: `${data.data.RutaLectura}#toolbar=0`,
                    allDataDocumento: data.data
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result.success === 1) {
                        this.getAllDocuments();
                    };
                };
            });
        }else{
            this.spinner.show();
            let dataMultiple = {
                IdPersona: data.data.IdPersona,
                IdDocumento: data.data.IdDocumento
            };
            this.gaService.postService('personas/selDocumentosMultiplesExpediente', dataMultiple).subscribe((res: any) => {
                this.dataDocsMultiples = res[0];
                if( this.dataDocsMultiples.length === 0 ){
                    Swal.fire({
                        title: '¡Alto!',
                        text: 'No existen documentos para mostrar.',
                        icon: 'warning',
                        confirmButtonText: 'Cerrar'
                    });
                }else{
                    setTimeout(() => {
                        this.spinner.hide();
                        this.showDocsMultiples()
                    }, 100);
                };
            }, (error: any) => {
                this.spinner.hide();
                Swal.fire({
                    title: '¡Error!',
                    text: 'Error 500 al regresar los documentos multiples del accionista.',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
            })
        };
    };

    addDocumento = () => {
        const documentos = this.allDocumentos.filter(x => {
            return x.IdEstatusArchivo === 2 || x.IdEstatusArchivo === 3 || x.IdEstatusArchivo === null
        });

        if (documentos.length === 0) {
            Swal.fire({
                title: '¡Información!',
                text: 'No hay documentos para guardar o actualizar',
                icon: 'info',
                confirmButtonText: 'Cerrar'
            });
            return;
        };

        const dialogRef = this.dialog.open(AddDocumentoComponent, {
            width: '90%',
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
                if (result.success === 1) {
                    this.getAllDocuments();
                };
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
                caption: 'Obligatorio',
                cellTemplate: 'documentoObligatorio'
            },
            {
                caption: 'Vigencia',
                dataField: 'Vigencia'
            },
            {
                caption: 'Fecha documento',
                dataField: 'FechaDocumento'
            },
            {
                caption: 'Estatus',
                cellTemplate: 'estatusDocumento'
            },
            {
                caption: 'Ver',
                allowEditing: false,
                cellTemplate: 'verDocumentoExpDig',
                width: 60
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

    showDocsMultiples = () =>{
        const dialogRef = this.dialog.open(ModalDocsMultiplesComponent, {
            width: '90%',
            disableClose: true,
            data: {
                title: 'Documentos ',
                dataDocs: this.dataDocsMultiples,
                nombreDoc: this.dataDocsMultiples[0].Documento
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.success === 1) {
                    const dialogRefShow = this.dialog.open(ShowMultipleDocumentoComponent, {
                        width: '100%',
                        height: '95%',
                        disableClose: true,
                        data: {
                            title: `${result.data.Documento} ${result.data.Nombre_RazonSocial}`,
                            urlGet: `${result.data.RutaLectura}#toolbar=0`,
                            allDataDocumento: result.data
                        }
                    });

                    dialogRefShow.afterClosed().subscribe(resultShow => {
                        if (resultShow) {
                            if (resultShow.success === 1) {
                                this.getAllDocuments();
                            };
                        };
                    });
                };

                if (result.success === 2) {
                    const dialogRedupdate = this.dialog.open(UpdateMultipleDocumentoComponent, {
                        width: '90%',
                        disableClose: true,
                        data: {
                            title: `Actualizar documento ${result.data.Documento}`,
                            allDataDocumento: result.data
                        }
                    });

                    dialogRedupdate.afterClosed().subscribe(resultShow => {
                        if (resultShow) {
                            if (resultShow.success === 1) {
                                this.getAllDocuments();
                            };
                        };
                    });
                };
            };
        });
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
