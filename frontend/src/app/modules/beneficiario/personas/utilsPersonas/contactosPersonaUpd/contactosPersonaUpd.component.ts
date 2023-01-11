import { Component, OnInit, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GaService } from 'app/services/ga.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import { ContactosModalComponent } from './contactosModal/contactosModal.component';
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
    selector: 'app-contactosPersonaUpd',
    templateUrl: './contactosPersonaUpd.component.html',
    styleUrls: ['./contactosPersonaUpd.component.scss']
})

export class ContactosPersonaUpdComponent implements OnInit, OnDestroy {
    /**INPUTUS OUTPUTS */
    @Input() gralDataPersona: any;
    @Input() catTipoContacto: any;
    /**INPUTUS OUTPUTS */

    userData: any;
    allContactos: any;

    /**Grid */
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
        private gaService: GaService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.userData = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
        this.getDataContactosPersona();
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

    AddContactos = () => {
        const dialogRef = this.dialog.open(ContactosModalComponent, {
            width: '100%',
            disableClose: true,
            data: {
                title: 'Agregar Contacto',
                dataPersona: this.gralDataPersona,
                dataContacto: null,
                agregar: true,
                catTipoContacto: this.catTipoContacto
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se guardo ningun contacto',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            } else {
                if (result.success === 1) {
                    this.getDataContactosPersona();
                } else {
                    Swal.fire({
                        title: '¡Alto!',
                        text: 'Ocurrio un erro al guardar el contacto',
                        icon: 'warning',
                        confirmButtonText: 'Cerrar'
                    });
                };
            };
        });
    };

    actualizarContacto = e => {
        const dialogRef = this.dialog.open(ContactosModalComponent, {
            width: '100%',
            disableClose: true,
            data: {
                title: 'Actualizar Contacto',
                dataPersona: this.gralDataPersona,
                dataContacto: e.data,
                agregar: false,
                catTipoContacto: this.catTipoContacto
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se actualizo ningun contacto',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            } else {
                if (result.success === 1) {
                    this.getDataContactosPersona();
                } else {
                    Swal.fire({
                        title: '¡Alto!',
                        text: 'Ocurrio un error al actualizar el contacto',
                        icon: 'warning',
                        confirmButtonText: 'Cerrar'
                    });
                };
            };
        });
    };

    eliminarContacto = e => {
        Swal.fire({
            title: `¿Estas seguro de eliminar el contacto?`,
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Eliminar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                const data = {
                    IdContacto: e.data.IdContacto,
                    IdTipoContacto: e.data.idTipoCont,
                    Dato: e.data.dato,
                    Predeterminado: e.data.predeterminado,
                    Ext: e.data.value,
                    PersonaContacto: e.data.personaContactar,
                    Usuario: this.userData.IdUsuario,
                    Opcion: 2
                };

                this.gaService.postService('personas/updContactoPersona', data).subscribe((res: any) => {
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
                        this.getDataContactosPersona();
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
                    text: 'No se guardo elimino el contacto.',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            };
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
            },
            {
                caption: 'Persona a contactar',
                dataField: 'personaContactar'
            },
            {
                caption: 'Editar',
                allowEditing: false,
                cellTemplate: 'actualizaContacto'
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
