import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
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
/**IMPORTS GRID */

@Component({
    selector: 'app-personas',
    templateUrl: './personas.component.html',
    styleUrls: ['./personas.component.scss']
})

export class PersonasComponent implements OnInit, OnDestroy {
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

    showAddPersona: boolean = false;
    catTipoPersona: any = [];
    catTipoMoral: any = [];
    catSexo: any = [];
    catPais: any = [];
    catIdentificacion: any = [];
    catEstadoCivil: any = [];
    catTipoContacto: any = [];
    catTipoDomicilio: any = [];

    /**array all todos los contactos */
    arrayAllContactos: any = [];
    currentIdContacto: string;
    stringIdContacto: string = 'contacto_';
    /**array all todos los contactos */

    /**array all todos los contactos */
    arrayAllDomicilios: any = [];
    currentIdDomicilios: string;
    stringIdDomicilio: string = 'domicilio_';
    /**array all todos los contactos */

    /**VARIABLES PARA EL UPDATE */
    actualizarPersona: boolean = false;
    dataPersonaUpdate: any = [];
    gralDataPersona: any = [];
    /**VARIABLES PARA EL UPDATE */

    personaForm = new FormGroup({
        idTipoPersona: new FormControl(0),
        idTipoMor: new FormControl(0),
        esAccionista: new FormControl(false),
        nombre_razon: new FormControl(''),
        apellidoPaterno: new FormControl(''),
        apellidoMaterno: new FormControl(''),
        alias: new FormControl(''),
        fechaNacimiento: new FormControl(''),
        idSexo: new FormControl(0),
        idPais: new FormControl(0),
        curp_registroPob: new FormControl(''),
        idPaisFiscal: new FormControl(0),
        idIdentificacion: new FormControl(0),
        datoIdentificacion: new FormControl(''),
        rfc_identificacion: new FormControl(''),
        idEstadoCivil: new FormControl(0)
    });

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
        this.getAllPersonas();
    };

    getAllPersonas = () => {
        this.gaService.getService('personas/allPersonas').subscribe((res: any) => {
            // if (res[0].length > 0) {
            this.allPersonas = res[0];
            this.createGrid();
            // } else {
            // Swal.fire('Error al regresar las personas', '', 'warning')
            // };
        });
    };

    addPersona = updPersona => {
        this.actualizarPersona = updPersona;
        if (!this.showAddPersona) {
            this.getAllCatalogos();
            this.personaForm.reset();
            this.arrayAllContactos = [];
            this.arrayAllDomicilios = [];
        } else {
            this.getAllPersonas();
            this.showAddPersona = !this.showAddPersona;
        };
    };

    getAllCatalogos = () => {
        this.spinner.show();
        this.gaService.getService('personas/allCatalogosAddPersonas').subscribe((res: any) => {
            if (res.length > 0) {
                this.catTipoPersona = res[0];
                this.catTipoMoral = res[1];
                this.catSexo = res[2];
                this.catPais = res[3];
                this.catIdentificacion = res[4];
                this.catEstadoCivil = res[5];
                this.catTipoContacto = res[6];
                this.catTipoDomicilio = res[7];

                if (!this.actualizarPersona) {
                    this.showAddPersona = true;
                    /**Agregamos el array para los contactos */
                    this.currentIdContacto = `${this.stringIdContacto}${this.arrayAllContactos.length + 1}`;
                    this.arrayAllContactos.push({ id: this.currentIdContacto, data: {} });
                    /**Agregamos el array para los contactos */
                    /**Agregamos el array para los domicilios */
                    this.currentIdDomicilios = `${this.stringIdDomicilio}${this.arrayAllDomicilios.length + 1}`;
                    this.arrayAllDomicilios.push({ id: this.currentIdDomicilios, data: {} });
                    /**Agregamos el array para los domicilios */

                    this.spinner.hide();
                } else {
                    this.getDataPersonaById();
                };
            } else {
                this.spinner.hide();
                Swal.fire('Error al regresar los catalogos', '', 'warning');
            };
        });
    };

    getDataPersonaById = () => {
        const data = {
            idPersona: this.dataPersonaUpdate.idPersona
        };
        this.gaService.postService('personas/selPersona', data).subscribe((res: any) => {
            if (res[0][0].success === 1) {
                this.gralDataPersona = res[1][0];
                this.showAddPersona = true;
                this.setDataForms(res[2], res[3]);
            } else {
                Swal.fire('Alto', res[0][0].msg, 'error');
            };
        });
    };

    setDataForms = (contactos: any, domicilios: any) => {
        //Seteamos los valores generales de la persona
        this.personaForm.controls.idTipoPersona.setValue(this.gralDataPersona.idTipoPersona);
        this.personaForm.controls.idTipoMor.setValue(this.gralDataPersona.idTipoMor);
        this.personaForm.controls.esAccionista.setValue(this.gralDataPersona.esAccionista === 1 ? true : false);
        this.personaForm.controls.nombre_razon.setValue(this.gralDataPersona.nombres_razon);
        this.personaForm.controls.apellidoPaterno.setValue(this.gralDataPersona.apellidoPaterno);
        this.personaForm.controls.apellidoMaterno.setValue(this.gralDataPersona.apellidoMaterno);
        this.personaForm.controls.alias.setValue(this.gralDataPersona.alias);
        this.personaForm.controls.fechaNacimiento.setValue(this.gralDataPersona.fechaNac_constitucion);
        this.personaForm.controls.idSexo.setValue(this.gralDataPersona.idSexo);
        this.personaForm.controls.idPais.setValue(this.gralDataPersona.idPais);
        this.personaForm.controls.curp_registroPob.setValue(this.gralDataPersona.curp_registroPob);
        this.personaForm.controls.idPaisFiscal.setValue(this.gralDataPersona.idPaisFiscal);
        this.personaForm.controls.idIdentificacion.setValue(this.gralDataPersona.idIdentificacion);
        this.personaForm.controls.datoIdentificacion.setValue(this.gralDataPersona.datoIdentificacion);
        this.personaForm.controls.rfc_identificacion.setValue(this.gralDataPersona.rfc_identificacion);
        this.personaForm.controls.idEstadoCivil.setValue(this.gralDataPersona.idEstCivil);

        //Seteamos los contactos de la persona
        for (let contacto of contactos) {
            setTimeout(() => {
                this.currentIdContacto = `${this.stringIdContacto}${this.arrayAllContactos.length + 1}`;
                this.arrayAllContactos.push({ id: this.currentIdContacto, data: contacto });
            }, 200);
        };

        //Seteamos los domicilios de la persona
        for (let domicilio of domicilios) {
            setTimeout(() => {
                this.currentIdContacto = `${this.stringIdDomicilio}${this.arrayAllDomicilios.length + 1}`;
                this.arrayAllDomicilios.push({ id: this.currentIdContacto, data: domicilio });
            }, 200);
        };

        // Una vez cargado todo cocultamos el spinner
        this.spinner.hide();
    };

    addContacto = () => {
        this.currentIdContacto = `${this.stringIdContacto}${this.arrayAllContactos.length + 1}`;
        this.arrayAllContactos.push({ id: this.currentIdContacto, data: {} });
    };
    removeContacto = () => {
        this.arrayAllContactos.splice(-1);
    };

    addDomicilio = () => {
        this.currentIdDomicilios = `${this.stringIdDomicilio}${this.arrayAllDomicilios.length + 1}`;
        this.arrayAllDomicilios.push({ id: this.currentIdDomicilios, data: {} });
    };
    removeDomicilio = () => {
        this.arrayAllDomicilios.splice(-1)
    };

    savePersona = () => {
        const validaPersona = this.validaFormPersona();
        if (validaPersona.success === 0) {
            Swal.fire(validaPersona.msg, '', 'warning');
            return
        };
        const validaContactosPersona = this.validaFormsContactos();
        if (validaContactosPersona.success === 0) {
            Swal.fire(validaContactosPersona.msg, '', 'warning');
            return
        };
        const validaDomicilioPeronsa = this.validaFormsDomicilios();
        if (validaDomicilioPeronsa.success === 0) {
            Swal.fire(validaDomicilioPeronsa.msg, '', 'warning');
            return
        };

        let xmlCotactos = '<contactos>';
        for (let arrayContacto of this.arrayAllContactos) {
            xmlCotactos += `<contacto><idTipCont>${arrayContacto.data.idTipCont}</idTipCont><dato>${arrayContacto.data.dato}</dato><predeterminado>${arrayContacto.data.predeterminado ? 1 : 0}</predeterminado><extencion>${arrayContacto.data.ext}</extencion></contacto>`;
        };
        xmlCotactos += '</contactos>';

        let xmlDomicilio = '<domicilios>';
        for (let arrayDomicilio of this.arrayAllDomicilios) {
            xmlDomicilio += `<domicilio><idTipDom>${arrayDomicilio.data.idTipDom}</idTipDom><esFiscal>${arrayDomicilio.data.esFiscal ? 1 : 0}</esFiscal><calle>${arrayDomicilio.data.calle}</calle><numExt>${arrayDomicilio.data.numExt}</numExt><numInt>${arrayDomicilio.data.numInt}</numInt><cp>${arrayDomicilio.data.cp}</cp><colonia_asentamiento>${arrayDomicilio.data.colonia_asentamiento}</colonia_asentamiento><delegacion_municipio>${arrayDomicilio.data.delegacion_municipio}</delegacion_municipio><ciudad_estado>${arrayDomicilio.data.ciudad_estado}</ciudad_estado><pais>${arrayDomicilio.data.pais}</pais><calle1>${arrayDomicilio.data.calle1}</calle1><calle2>${arrayDomicilio.data.calle2}</calle2></domicilio>`;
        };
        xmlDomicilio += '</domicilios>';

        Swal.fire({
            title: `¿Quieres guardar los datos de ${this.personaForm.controls.nombre_razon.value}?`,
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Guardar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();

                const jsonPersona = {
                    idTipoPersona: this.personaForm.controls.idTipoPersona.value,
                    idTipoMor: this.personaForm.controls.idTipoMor.value,
                    esAccionista: this.personaForm.controls.esAccionista.value ? 1 : 0,
                    nombres_razon: this.personaForm.controls.nombre_razon.value,
                    apellidoPaterno: this.personaForm.controls.apellidoPaterno.value,
                    apellidoMaterno: this.personaForm.controls.apellidoMaterno.value,
                    alias: this.personaForm.controls.alias.value,
                    fechaNac_constitucion: this.personaForm.controls.fechaNacimiento.value,
                    idSexo: this.personaForm.controls.idSexo.value,
                    idPais: this.personaForm.controls.idPais.value,
                    curp_registroPob: this.personaForm.controls.curp_registroPob.value,
                    idPaisFiscal: this.personaForm.controls.idPaisFiscal.value,
                    idIdentificacion: this.personaForm.controls.idIdentificacion.value,
                    datoIdentificacion: this.personaForm.controls.datoIdentificacion.value,
                    rfc_identificacion: this.personaForm.controls.rfc_identificacion.value,
                    idEstCivil: this.personaForm.controls.idEstadoCivil.value,
                    xmlContacto: xmlCotactos,
                    xmlDomicilio: xmlDomicilio
                };

                this.gaService.postService('personas/insPersona', jsonPersona).subscribe((res: any) => {
                    this.spinner.hide();
                    if (res[0][0].success === 1) {
                        Swal.fire(res[0][0].msg, '', 'success');
                        setTimeout(() => {
                            this.addPersona(false);
                        }, 1000);
                    } else if (res[0][0].success === 2) {
                        Swal.fire(res[0][0].msg, '', 'warning');
                    } else {
                        Swal.fire('Ocurrio un error al guardar la persona, intentelo mas tarde, si el problema continua contacte al administrador.', '', 'warning');
                    };
                });
            } else if (result.isDenied) {
                Swal.fire('No se guardo la informacion', '', 'info')
            };
        });
    };

    updatePersona = () => {
        const validaPersona = this.validaFormPersona();
        if (validaPersona.success === 0) {
            Swal.fire(validaPersona.msg, '', 'warning');
            return
        };
        const validaContactosPersona = this.validaFormsContactos();
        if (validaContactosPersona.success === 0) {
            Swal.fire(validaContactosPersona.msg, '', 'warning');
            return
        };
        const validaDomicilioPeronsa = this.validaFormsDomicilios();
        if (validaDomicilioPeronsa.success === 0) {
            Swal.fire(validaDomicilioPeronsa.msg, '', 'warning');
            return
        };

        let xmlCotactos = '<contactos>';
        for (let arrayContacto of this.arrayAllContactos) {
            console.log('arrayContacto', arrayContacto)
            xmlCotactos += `<contacto><idTipCont>${arrayContacto.data.idTipCont}</idTipCont><dato>${arrayContacto.data.dato}</dato><predeterminado>${arrayContacto.data.predeterminado ? 1 : 0}</predeterminado><extencion>${arrayContacto.data.ext}</extencion></contacto>`;
        };
        xmlCotactos += '</contactos>';

        let xmlDomicilio = '<domicilios>';
        for (let arrayDomicilio of this.arrayAllDomicilios) {
            xmlDomicilio += `<domicilio><idTipDom>${arrayDomicilio.data.idTipDom}</idTipDom><esFiscal>${arrayDomicilio.data.esFiscal ? 1 : 0}</esFiscal><calle>${arrayDomicilio.data.calle}</calle><numExt>${arrayDomicilio.data.numExt}</numExt><numInt>${arrayDomicilio.data.numInt}</numInt><cp>${arrayDomicilio.data.cp}</cp><colonia_asentamiento>${arrayDomicilio.data.colonia_asentamiento}</colonia_asentamiento><delegacion_municipio>${arrayDomicilio.data.delegacion_municipio}</delegacion_municipio><ciudad_estado>${arrayDomicilio.data.ciudad_estado}</ciudad_estado><pais>${arrayDomicilio.data.pais}</pais><calle1>${arrayDomicilio.data.calle1}</calle1><calle2>${arrayDomicilio.data.calle2}</calle2></domicilio>`;
        };
        xmlDomicilio += '</domicilios>';

        Swal.fire({
            title: `¿Quieres actualizar los datos de ${this.personaForm.controls.nombre_razon.value}?`,
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();

                const jsonPersona = {
                    idPersona: this.dataPersonaUpdate.idPersona,
                    idTipoPersona: this.personaForm.controls.idTipoPersona.value,
                    idTipoMor: this.personaForm.controls.idTipoMor.value,
                    esAccionista: this.personaForm.controls.esAccionista.value ? 1 : 0,
                    nombres_razon: this.personaForm.controls.nombre_razon.value,
                    apellidoPaterno: this.personaForm.controls.apellidoPaterno.value,
                    apellidoMaterno: this.personaForm.controls.apellidoMaterno.value,
                    alias: this.personaForm.controls.alias.value,
                    fechaNac_constitucion: this.personaForm.controls.fechaNacimiento.value,
                    idSexo: this.personaForm.controls.idSexo.value,
                    idPais: this.personaForm.controls.idPais.value,
                    curp_registroPob: this.personaForm.controls.curp_registroPob.value,
                    idPaisFiscal: this.personaForm.controls.idPaisFiscal.value,
                    idIdentificacion: this.personaForm.controls.idIdentificacion.value,
                    datoIdentificacion: this.personaForm.controls.datoIdentificacion.value,
                    rfc_identificacion: this.personaForm.controls.rfc_identificacion.value,
                    idEstCivil: this.personaForm.controls.idEstadoCivil.value,
                    xmlContacto: xmlCotactos,
                    xmlDomicilio: xmlDomicilio
                };

                this.gaService.postService('personas/updPersona', jsonPersona).subscribe((res: any) => {
                    Swal.fire(res[0][0].msg, '', res[0][0].success === 1 ? 'success' : 'error');
                    this.spinner.hide();
                    setTimeout(() => {
                        this.addPersona(false);
                    }, 1000);
                });

            } else if (result.isDenied) {
                Swal.fire('No se guardo la informacion', '', 'info')
            };
        });
    };

    crudPersona = e => {
        const { proceso, data } = e;
        if (proceso === 1) {
            this.dataPersonaUpdate = [];
            this.dataPersonaUpdate = data;
            this.addPersona(true);
        } else {
            Swal.fire({
                title: `¿Quieres eliminar a ${data.nombre}?`,
                showDenyButton: true,
                // showCancelButton: true,
                confirmButtonText: 'Eliminar',
                denyButtonText: `Cancelar`,
            }).then((result) => {
                if (result.isConfirmed) {
                    const dataSend = {
                        idPersona: data.idPersona
                    };
                    this.gaService.postService('personas/delPersona', dataSend).subscribe((res: any) => {
                        if (res[0][0].success === 1) {
                            Swal.fire('Listo', res[0][0].msg, 'success');
                            this.getAllPersonas();
                        } else {
                            Swal.fire('Alto', res[0][0].msg, 'error')
                            this.getAllPersonas();
                        };
                    });
                } else {
                    Swal.fire('', 'No se realizo ninguna accion.', 'success')
                }
            });
        };
    };

    createGrid = () => {
        this.toolbar = [];
        this.columns = [
            {
                caption: 'Nombre / Razon',
                dataField: 'nombre',
                cssClass: 'asignacion2'
            },
            {
                caption: 'Alias',
                dataField: 'alias'
            },
            {
                caption: 'Tipo Persona',
                dataField: 'tipoPersona'
            },
            {
                caption: 'Es accionista',
                dataField: 'esAccionista'
            },
            {
                caption: 'Sexo',
                dataField: 'sexo'
            },
            {
                caption: 'Pais',
                dataField: 'pais'
            },
            {
                caption: 'Curp / Registro',
                dataField: 'curpRegistro'
            },
            {
                caption: 'Pais Fiscal',
                dataField: 'paisFiscal'
            },
            {
                caption: 'Identificacion',
                dataField: 'identificacion'
            },
            {
                caption: 'Estado Civil',
                dataField: 'estadoCivil'
            },
            {
                caption: '',
                allowEditing: false,
                cellTemplate: 'crudPersonas'
            }
        ];
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
        this.Editing = { allowupdate: true, mode: 'cell' }; // *cambiar a batch para editar varias celdas a la vez*/
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

    datosMessage = e => {
        this.datosEvent = e.data;
    };

    receiveMessage($event) {
        try {
        } catch (error) {
            Swal.fire('Error inesperado', '', 'error')
        }
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };

    shortDateForma = date => {
        let today = new Date(date);
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        return (mm + '/' + dd + '/' + yyyy);
    };

    /**
     * #REGION VALIDA FORMULARIOS
     */

    validaFormPersona = () => {
        if (this.personaForm.controls.idTipoPersona.value === null || this.personaForm.controls.idTipoPersona.value === undefined || this.personaForm.controls.idTipoPersona.value === 0) {
            return { success: 0, msg: 'Debes seleccionar el tipo de personas' }
        };
        if (this.personaForm.controls.idTipoMor.value === null || this.personaForm.controls.idTipoMor.value === undefined || this.personaForm.controls.idTipoMor.value === 0) {
            return { success: 0, msg: 'Debes seleccionar el tipo moral' }
        };
        if (this.personaForm.controls.nombre_razon.value === null || this.personaForm.controls.nombre_razon.value === undefined || this.personaForm.controls.nombre_razon.value === '') {
            return { success: 0, msg: 'Debes insertar el nombre del usuario' }
        };
        if (this.personaForm.controls.apellidoPaterno.value === null || this.personaForm.controls.apellidoPaterno.value === undefined || this.personaForm.controls.apellidoPaterno.value === '') {
            return { success: 0, msg: 'Debes insertar el apellido paterno del usuario' }
        };
        if (this.personaForm.controls.apellidoMaterno.value === null || this.personaForm.controls.apellidoMaterno.value === undefined || this.personaForm.controls.apellidoMaterno.value === '') {
            return { success: 0, msg: 'Debes insertar el apellido materno del usuario' }
        };
        if (this.personaForm.controls.alias.value === null || this.personaForm.controls.alias.value === undefined || this.personaForm.controls.alias.value === '') {
            return { success: 0, msg: 'Debes insertar el alias del usuario' }
        };
        if (this.personaForm.controls.fechaNacimiento.value === null || this.personaForm.controls.fechaNacimiento.value === undefined || this.personaForm.controls.fechaNacimiento.value === '') {
            return { success: 0, msg: 'Debes seleccionar la fecha del usuario' }
        };
        if (this.personaForm.controls.idSexo.value === null || this.personaForm.controls.idSexo.value === undefined || this.personaForm.controls.idSexo.value === 0) {
            return { success: 0, msg: 'Debes seleccionar el sexo de personas' }
        };
        if (this.personaForm.controls.idPais.value === null || this.personaForm.controls.idPais.value === undefined || this.personaForm.controls.idPais.value === 0) {
            return { success: 0, msg: 'Debes seleccionar el pais de personas' }
        };
        if (this.personaForm.controls.curp_registroPob.value === null || this.personaForm.controls.curp_registroPob.value === undefined || this.personaForm.controls.curp_registroPob.value === '') {
            return { success: 0, msg: 'Debes insertar el curp o registro de poblacion del usuario' }
        };
        if (this.personaForm.controls.idPaisFiscal.value === null || this.personaForm.controls.idPaisFiscal.value === undefined || this.personaForm.controls.idPaisFiscal.value === 0) {
            return { success: 0, msg: 'Debes seleccionar el pais fiscal de personas' }
        };
        if (this.personaForm.controls.idIdentificacion.value === null || this.personaForm.controls.idIdentificacion.value === undefined || this.personaForm.controls.idIdentificacion.value === 0) {
            return { success: 0, msg: 'Debes seleccionar el tipo de identificacion de personas' }
        };
        if (this.personaForm.controls.datoIdentificacion.value === null || this.personaForm.controls.datoIdentificacion.value === undefined || this.personaForm.controls.datoIdentificacion.value === '') {
            return { success: 0, msg: 'Debes insertar el dato de la identificacion' }
        };
        if (this.personaForm.controls.rfc_identificacion.value === null || this.personaForm.controls.rfc_identificacion.value === undefined || this.personaForm.controls.rfc_identificacion.value === '') {
            return { success: 0, msg: 'Debes insertar el rfc del usuario' };
        };
        if (this.personaForm.controls.idEstadoCivil.value === null || this.personaForm.controls.idEstadoCivil.value === undefined || this.personaForm.controls.idEstadoCivil.value === 0) {
            return { success: 0, msg: 'Debes Seleccionar el estado civil del usuario' }
        };

        return { success: 1, msg: '' }
    };

    validaFormsContactos = () => {
        let totalDatoPredeterminado: number = 0;
        const validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.arrayAllContactos.length === 0) {
            return { success: 0, msg: 'Ingrese un medio de contacto de la persona.' }
        } else {
            for (let arrayContacto of this.arrayAllContactos) {
                if (JSON.stringify(arrayContacto.data) === '{}') {
                    return { success: 0, msg: `Los datos del contacto no pueden ir vacios en el formulario #${arrayContacto.id.split("_").pop()}` }
                } else {
                    if (arrayContacto.data.predeterminado) {
                        totalDatoPredeterminado += 1;
                    };
                    if (arrayContacto.data.idTipCont === null || arrayContacto.data.idTipCont === undefined || arrayContacto.data.idTipCont === 0) {
                        return { success: 0, msg: `Debe seleccionar el tipo de contacto en el formulario contactos #${arrayContacto.id.split("_").pop()}` };
                    };
                    if (arrayContacto.data.dato === null || arrayContacto.data.dato === undefined || arrayContacto.data.dato === '') {
                        return { success: 0, msg: `Debe insertar el dato para contactar en el formulario contactos #${arrayContacto.id.split("_").pop()}` };
                    };
                    if (arrayContacto.data.idTipCont === 1) {
                        if (!arrayContacto.data.dato.match(validRegex)) {
                            return { success: 0, msg: `Debe insertar un email valido para el contacto en el formulario contactos #${arrayContacto.id.split("_").pop()}` };
                        };
                    };
                };
            };
            if (totalDatoPredeterminado === 0) {
                return { success: 0, msg: `Debe seleccionar un medio de contacto como predeterminado de los ${this.arrayAllContactos.length} agregados.` };
            };
            if (totalDatoPredeterminado > 1) {
                return { success: 0, msg: `Solo puede tener 1 medio de contacto como predeterminado.` };
            };
            return { success: 1, msg: `` }
        };
    };

    validaFormsDomicilios = () => {
        let totalDomicilioFiscal: number = 0;
        if (this.arrayAllDomicilios.length === 0) {
            return { success: 0, msg: 'Debe agregar al menos 1 domicilio para la persona.' };
        } else {
            for (let arrayDomicilio of this.arrayAllDomicilios) {
                if (JSON.stringify(arrayDomicilio.data) === '{}') {
                    return { success: 0, msg: `Los datos del domicilio no pueden ir vacios en el formulario de domicilio #${arrayDomicilio.id.split("_").pop()}` };
                } else {
                    if (arrayDomicilio.data.esFiscal) {
                        totalDomicilioFiscal += 1;
                    };
                    if (arrayDomicilio.data.idTipDom === null || arrayDomicilio.data.idTipDom === undefined || arrayDomicilio.data.idTipDom === 0) {
                        return { success: 0, msg: `Debe seleccionar el tipo de domicilio en el formulario de domicilio #${arrayDomicilio.id.split("_").pop()}` };
                    };
                    if (arrayDomicilio.data.calle === null || arrayDomicilio.data.calle === undefined || arrayDomicilio.data.calle === '') {
                        return { success: 0, msg: `Debe insertar la calle en el formulario de domicilio #${arrayDomicilio.id.split("_").pop()}` };
                    };
                    if (arrayDomicilio.data.numExt === null || arrayDomicilio.data.numExt === undefined || arrayDomicilio.data.numExt === '') {
                        return { success: 0, msg: `Debe insertar el numero exterior en el formulario de domicilio #${arrayDomicilio.id.split("_").pop()}` };
                    };
                    if (arrayDomicilio.data.cp === null || arrayDomicilio.data.cp === undefined || arrayDomicilio.data.cp === '') {
                        return { success: 0, msg: `Debe insertar el codigo postal en el formulario de domicilio #${arrayDomicilio.id.split("_").pop()}` };
                    };
                    if (arrayDomicilio.data.colonia_asentamiento === null || arrayDomicilio.data.colonia_asentamiento === undefined || arrayDomicilio.data.colonia_asentamiento === '') {
                        return { success: 0, msg: `Debe insertar la colonia o asentamiento en el formulario de domicilio #${arrayDomicilio.id.split("_").pop()}` };
                    };
                    if (arrayDomicilio.data.delegacion_municipio === null || arrayDomicilio.data.delegacion_municipio === undefined || arrayDomicilio.data.delegacion_municipio === '') {
                        return { success: 0, msg: `Debe insertar la delegacion o monucipio en el formulario de domicilio #${arrayDomicilio.id.split("_").pop()}` };
                    };
                    if (arrayDomicilio.data.ciudad_estado === null || arrayDomicilio.data.ciudad_estado === undefined || arrayDomicilio.data.ciudad_estado === '') {
                        return { success: 0, msg: `Debe insertar la ciudad o el estado en el formulario de domicilio #${arrayDomicilio.id.split("_").pop()}` };
                    };
                };
            };
            if (totalDomicilioFiscal === 0) {
                return { success: 0, msg: `Debe seleccionar 1 domicilio fiscal de los ${this.arrayAllDomicilios.length} agregados.` };
            };
            if (totalDomicilioFiscal > 1) {
                return { success: 0, msg: `Solo puede tener 1 domicilio fiscal` };
            };
            return { success: 1, msg: '' };
        };
    };
    /**
    * #REGION VALIDA FORMULARIOS
    */

};
