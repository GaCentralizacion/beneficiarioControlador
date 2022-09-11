import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { GaService } from 'app/services/ga.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { ContactosComponent } from './utilsPersonas/contactosPersona/contactos.component';
import { DomiciliosComponent } from './utilsPersonas/domiciliosPersona/domicilios.component';
import { environment } from 'environments/environment';
import { RelacionFamiliarComponent } from './utilsPersonas/relacionFamiliar/relacionFamiliar.component';
import { ExpedienteDigitalComponent } from './utilsPersonas/expedienteDigital/expedienteDigital.component';
import { ContactosPersonaUpdComponent } from './utilsPersonas/contactosPersonaUpd/contactosPersonaUpd.component';
import { DomiciliosPersonaUpdComponent } from './utilsPersonas/domiciliosPersonaUpd/domiciliosPersonaUpd.component';

const REGEX_RFC_FIS = /^([A-ZÑ&]{4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
const REGEX_RFC_MOR = /^([A-ZÑ&]{3}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;

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
    today = new Date();
    @ViewChild(ContactosComponent) contactoComponent: ContactosComponent;
    @ViewChild(DomiciliosComponent) domicilioComponent: DomiciliosComponent;
    @ViewChild(RelacionFamiliarComponent) relacionFamiliarComponent: RelacionFamiliarComponent;
    @ViewChild(ExpedienteDigitalComponent) expedienteDigitalComponent: ExpedienteDigitalComponent;
    @ViewChild(ContactosPersonaUpdComponent) contactosPersonaUpdComponent: ContactosPersonaUpdComponent;
    @ViewChild(DomiciliosPersonaUpdComponent) domiciliosPersonaUpdComponent: DomiciliosPersonaUpdComponent;
    idMenuApp: number = 0;

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

    muestraGridMoralInterna: boolean = false
    columnsMoralInterna = [];
    toolbarMoralInterna: Toolbar[];
    gridOptionsMoralInterna: IGridOptions;
    /**Grid */

    /**Variables para catalogos */
    showAddPersona: boolean = false;
    catTipoPersona: any = [];
    catTipoMoral: any = [];
    catSexo: any = [];
    catPais: any = [];
    catIdentificacion: any = [];
    catEstadoCivil: any = [];
    catTipoContacto: any = [];
    catTipoDomicilio: any = [];
    catRelacionFamiliar: any = [];
    catTipoPatrimonial: any = [];
    catRegimenFiscal: any = [];
    /**Variables para catalogos */

    /**array all todos los contactos */
    arrayAllContactos: any = [];
    currentIdContacto: string;
    stringIdContacto: string = 'contacto_';
    /**array all todos los contactos */

    /**array all todos los domicilios */
    arrayAllDomicilios: any = [];
    currentIdDomicilios: string;
    stringIdDomicilio: string = 'domicilio_';
    /**array all todos los domicilios */

    /**VARIABLES PARA EL UPDATE */
    actualizarPersona: boolean = false;
    dataPersonaUpdate: any = [];
    gralDataPersona: any = [];
    paisDataPersona: any = [];
    /**VARIABLES PARA EL UPDATE */

    /**VARIABLES PARA EL UPDATE */
    accionesUsuario: any;
    menuApp: any;
    userData: any;
    /**VARIABLES LOCALSTORAGE */

    personaForm: FormGroup;
    focusTabs: number = 0;
    hiddenForm: boolean = true;
    textModificacion: string = '';

    /**VARIABLES OPTIONCES */
    // IdTipoPer
    IdTipoMoralOption: any;
    EsAccionista: any;
    RFC: any;
    Nombre_RazonSocial: any;
    APaterno: any;
    AMaterno: any;
    Alias: any;
    IdPais: any;
    Fecha_nacimiento_Constitucion: any;
    IdTipoSexo: any;
    Registro_de_poblacion: any;
    IdTipoIdentificacion: any;
    Identificiacion: any;
    IdEstadoCivil: any;
    IdRegimenOption: any;
    /**VARIABLES OPTIONCES */

    rfcMaxLenght: number = 0;
    nombrePersona: string = '';

    /**VARIABLES PARA LA PERSONA MORAL INTERNA */
    moralInterna: boolean = false;
    dataPersonaMoralInterna: any;
    showContactos: boolean = true;
    showRegimen: boolean = false;
    /**VARIABLES PARA LA PERSONA MORAL INTERNA */

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private gaService: GaService,
        private spinner: NgxSpinnerService,
        private _router: Router
    ) {

    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.personaForm = this._formBuilder.group({
            idTipoPersona: [0, Validators.min(1)],
            idTipoMor: [0, Validators.min(1)],
            regimenFiscal: [0],
            esAccionista: false,
            nombre_razon: ['', Validators.required],
            apellidoPaterno: ['', Validators.required],
            apellidoMaterno: ['', Validators.required],
            alias: ['', Validators.required],
            fechaNacimiento: ['', Validators.required],
            idSexo: [0, Validators.min(1)],
            idPais: [[0], Validators.min(1)],
            curp_registroPob: ['', Validators.min(1)],
            idIdentificacion: [0, Validators.min(1)],
            datoIdentificacion: ['', Validators.required],
            rfc_identificacion: ['', Validators.required],
            idEstadoCivil: [0, Validators.min(1)]
        });

        this.accionesUsuario = JSON.parse(localStorage.getItem(environment._varsLocalStorage.accionesUser));
        this.menuApp = JSON.parse(localStorage.getItem(environment._varsLocalStorage.menuApp));
        this.userData = JSON.parse(localStorage.getItem(environment._varsLocalStorage.dataUsuario));
        if (!this.accionesUsuario) {
            Swal.fire({
                title: '¡Error!',
                text: '[AccionesError]',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            this._router.navigateByUrl('sign-in');
        };
        this.getAllPersonas();

        for (let menuApp of this.menuApp) {
            if (menuApp.Link === this._router.url) {
                this.idMenuApp = menuApp.IdMenuApp;
            };
        };
    };

    getAllPersonas = () => {
        this.muestraGrid = false;
        this.gaService.getService(`personas/allPersonas?opcion=1&usuario=${this.userData.IdUsuario}`).subscribe((res: any) => {
            this.allPersonas = res[0];
            this.allPersonas.forEach((value, key) => {
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

    addPersona = updPersona => {
        this.actualizarPersona = updPersona;
        if (!this.showAddPersona) {
            this.focusTabs = 0;
            this.hiddenForm = true;
            this.personaForm.controls.idTipoPersona.reset();
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
        this.nombrePersona = '';
        this.moralInterna = false;
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
                this.catRelacionFamiliar = res[8];
                this.catTipoPatrimonial = res[9];
                this.catRegimenFiscal = res[11];

                this.initVarFormPersona();
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
                Swal.fire({
                    title: '¡Alto!',
                    text: 'Error al regresar los catalogos',
                    icon: 'warning',
                    confirmButtonText: 'Cerrar'
                });
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
    };

    getCamposForm = tipoPersona => {
        if (tipoPersona === 0) {
            Swal.fire({
                title: '¡Información!',
                text: 'Debe seleccionar el tipo de persona',
                icon: 'info',
                confirmButtonText: 'Cerrar'
            });
            this.hiddenForm = true;
            this.showContactos = false;
        } else {
            this.spinner.show();
            this.hiddenForm = true;
            this.resetVariablesOpciones();
            const data = {
                IdMenuApp: this.idMenuApp,
                IdTipoPer: tipoPersona
            };
            this.gaService.postService('personas/allFormOptions', data).subscribe((res: any) => {
                if (res[0].length > 0) {
                    this.setVariablesForm(res[0], tipoPersona);
                    this.hiddenForm = false;
                    this.showContactos = true;
                } else {
                    Swal.fire({
                        title: '¡Alto!',
                        text: 'No se obtuvo la regla del fomulario',
                        icon: 'warning',
                        confirmButtonText: 'Cerrar'
                    });
                };
                this.spinner.hide();

            }, (error: any) => {
                Swal.fire({
                    title: '¡Error!',
                    text: error.error.text,
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
                this.spinner.hide();
            });
        };
    };

    getDataPersonaById = () => {
        this.textModificacion = '';
        const data = {
            Opcion: 2,
            Usuario: this.userData.IdUsuario,
            IdPersona: this.dataPersonaUpdate.IdPersona
        };
        this.gaService.postService('personas/selPersona', data).subscribe((res: any) => {
            if (res.length > 0) {
                this.getCamposForm(res[0][0].IdTipoPer);
                this.gralDataPersona = res[0][0];
                this.paisDataPersona = res[3];
                if (this.gralDataPersona.IdTipoPer === 1) {
                    this.nombrePersona = `${this.gralDataPersona.Nombre_RazonSocial} ${this.gralDataPersona.APaterno} ${this.gralDataPersona.AMaterno}`;
                } else {
                    this.nombrePersona = `${this.gralDataPersona.Nombre_RazonSocial}`;
                };
                this.showAddPersona = true;
                this.setDataForms();
                if (this.gralDataPersona?.FechaModificacion !== null) {
                    let dateModificacion = `${this.gralDataPersona?.FechaModificacion.split('T')[0].split('-')[2]}/${this.gralDataPersona?.FechaModificacion.split('T')[0].split('-')[1]}/${this.gralDataPersona?.FechaModificacion.split('T')[0].split('-')[0]}`;
                    this.textModificacion = `Modificado el ${dateModificacion} por ${this.gralDataPersona?.NombUsuarioModificacion}`;
                } else {
                    let dateCreacion = `${this.gralDataPersona?.FechaAlta.split('T')[0].split('-')[2]}/${this.gralDataPersona?.FechaAlta.split('T')[0].split('-')[1]}/${this.gralDataPersona?.FechaAlta.split('T')[0].split('-')[0]}`;
                    this.textModificacion = `Registrado el ${dateCreacion} por ${this.gralDataPersona?.NombUsuarioAlta}`;
                };
            } else {
                Swal.fire({
                    title: '¡Alto!',
                    text: 'Ocurrio un error al regresar los datos de la persona',
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

    setDataForms = () => {
        this.spinner.show();
        //Seteamos los valores generales de la persona
        let date = this.gralDataPersona.Fecha_nacimiento_Constitucion.split('T')[0];
        let dateParts = date.split("/");
        let dateObject = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const fechaEntregaInput = this.FechaDiaCorrecto(dateObject);
        this.personaForm.controls.idTipoPersona.setValue(this.gralDataPersona.IdTipoPer);
        this.personaForm.controls.idTipoMor.setValue(this.gralDataPersona.IdTipoMoral);
        this.personaForm.controls.regimenFiscal.setValue(this.gralDataPersona.IdRegimen === null ? 0 : this.gralDataPersona.IdRegimen);
        this.personaForm.controls.esAccionista.setValue(this.gralDataPersona.EsAccionista);
        this.personaForm.controls.nombre_razon.setValue(this.gralDataPersona.Nombre_RazonSocial);
        this.personaForm.controls.apellidoPaterno.setValue(this.gralDataPersona.APaterno);
        this.personaForm.controls.apellidoMaterno.setValue(this.gralDataPersona.AMaterno);
        this.personaForm.controls.alias.setValue(this.gralDataPersona.Alias);
        this.personaForm.controls.fechaNacimiento.setValue(fechaEntregaInput);
        this.personaForm.controls.idSexo.setValue(this.gralDataPersona.IdTipoSexo);
        if (this.paisDataPersona.length === 0) {
            this.personaForm.controls.idPais.setValue([this.gralDataPersona.IdPais])
        } else {
            let array: any = [];
            for (let data of this.paisDataPersona) {
                array.push(data.IdPais)
            };
            this.personaForm.controls.idPais.setValue(array);
        };
        this.personaForm.controls.curp_registroPob.setValue(this.gralDataPersona.Registro_de_poblacion);
        this.personaForm.controls.idIdentificacion.setValue(this.gralDataPersona.IdTipoIdentificacion);
        this.personaForm.controls.datoIdentificacion.setValue(this.gralDataPersona.Identificiacion);
        this.personaForm.controls.rfc_identificacion.setValue(this.gralDataPersona.RFC);
        this.personaForm.controls.idEstadoCivil.setValue(this.gralDataPersona.IdEstadoCivil);

        //Seteamos los contactos de la persona Si es una persona moral interna no aplica
        if (this.gralDataPersona.IdTipoPer === 2 && this.gralDataPersona.IdTipoMoral === 2) {
            this.personaForm.controls.regimenFiscal.addValidators(Validators.min(1));
            this.personaForm.controls.regimenFiscal.updateValueAndValidity();
            this.showRegimen = true;
            this.getDataContactosPersonaMoralInterna();
        } else {
            this.moralInterna = false;
            this.personaForm.controls.regimenFiscal.clearValidators();
            this.personaForm.controls.regimenFiscal.updateValueAndValidity();
        };
        // Una vez cargado todo cocultamos el spinner
        this.hiddenForm = false;
        this.spinner.hide();
    };

    getDataContactosPersonaMoralInterna = () => {
        const data = {
            Opcion: 3,
            Usuario: this.userData.IdUsuario,
            IdPersona: this.dataPersonaUpdate.IdPersona
        };
        this.gaService.postService('personas/selPersona', data).subscribe((res: any) => {
            this.moralInterna = true;
            if (res.length > 0) {
                this.dataPersonaMoralInterna = res[0];
                this.createGridMoralInterna();
            } else {
                Swal.fire({
                    title: '¡Alto!',
                    text: 'Ocurrio un error al regresar los contactos de los representantes',
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

    changeTipoMoral = e => {
        this.showRegimen = false;
        this.personaForm.controls.regimenFiscal.setValue(0);
        this.personaForm.controls.regimenFiscal.clearValidators();
        this.personaForm.controls.regimenFiscal.updateValueAndValidity();
        if (!this.actualizarPersona) {
            if (e === 1) {
                if (this.arrayAllContactos.length === 0) {
                    this.currentIdContacto = `${this.stringIdContacto}${this.arrayAllContactos.length + 1}`;
                    this.arrayAllContactos.push({ id: this.currentIdContacto, data: {} });
                };
                this.showContactos = true;
            } else {
                this.arrayAllContactos = [];
                this.showContactos = false;
                this.personaForm.controls.regimenFiscal.addValidators(Validators.min(1));
                this.personaForm.controls.regimenFiscal.updateValueAndValidity();
                this.showRegimen = true;
            };
        } else {
            this.showContactos = true;
            if (e === 1) {
                if (this.arrayAllContactos.length === 0) {
                    this.currentIdContacto = `${this.stringIdContacto}${this.arrayAllContactos.length + 1}`;
                    this.arrayAllContactos.push({ id: this.currentIdContacto, data: {} });
                };
                this.moralInterna = false;
            } else {
                this.arrayAllContactos = [];
                this.getDataContactosPersonaMoralInterna();
                setTimeout(() => {
                    this.createGridMoralInterna();
                }, 2000);
                this.personaForm.controls.regimenFiscal.addValidators(Validators.min(1));
                this.personaForm.controls.regimenFiscal.updateValueAndValidity();
                this.showRegimen = true;
                this.moralInterna = true;
            };
        };
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
        if (this.personaForm.invalid) {
            Swal.fire({
                title: '¡Alto!',
                text: 'Completa los campos obligatorios de la persona',
                icon: 'warning',
                confirmButtonText: 'Cerrar'
            });
            this.focusTabs = 0;
            this.personaForm.markAllAsTouched();
            return;
        };

        const validaContactosPersona = this.validaFormsContactos();
        if (validaContactosPersona.success === 0) {
            this.focusTabs = 1;
            Swal.fire({
                title: '¡Alto!',
                text: validaContactosPersona.msg,
                icon: 'warning',
                confirmButtonText: 'Cerrar'
            });
            this.contactoComponent.setManualError();
            return
        };

        const validaDomicilioPeronsa = this.validaFormsDomicilios();
        if (validaDomicilioPeronsa.success === 0) {
            this.focusTabs = 2;
            Swal.fire({
                title: '¡Alto!',
                text: validaDomicilioPeronsa.msg,
                icon: 'warning',
                confirmButtonText: 'Cerrar'
            });
            this.domicilioComponent.setManualError();
            return
        };

        let xmlCotactos = ''
        if (this.arrayAllContactos.length > 0) {
            xmlCotactos = '<Contactos>';
            for (let arrayContacto of this.arrayAllContactos) {
                xmlCotactos += `<Contacto><IdTipoContacto>${arrayContacto.data.idTipCont}</IdTipoContacto><Dato>${arrayContacto.data.dato === undefined ? '' : arrayContacto.data.dato}</Dato><Predeterminado>${arrayContacto.data.predeterminado ? 1 : 0}</Predeterminado><Ext>${arrayContacto.data.ext}</Ext><PersonaContacto>${arrayContacto.data.personaContactar}</PersonaContacto></Contacto>`;
            };
            xmlCotactos += '</Contactos>';
        };

        let xmlDomicilio = '';
        if (this.arrayAllDomicilios.length > 0) {
            xmlDomicilio = '<Domicilios>';
            for (let arrayDomicilio of this.arrayAllDomicilios) {
                xmlDomicilio += `<Domicilio><IdTipoDomicilio>${arrayDomicilio.data.idTipDom}</IdTipoDomicilio><EsFiscal>${arrayDomicilio.data.esFiscal ? 1 : 0}</EsFiscal><Calle>${arrayDomicilio.data.calle}</Calle><NumExterior>${arrayDomicilio.data.numExt}</NumExterior><NumInterior>${arrayDomicilio.data.numInt === undefined ? '' : arrayDomicilio.data.numInt}</NumInterior><CodigoPostal>${arrayDomicilio.data.cp}</CodigoPostal><Colonia_Asentamiento>${arrayDomicilio.data.colonia_asentamiento}</Colonia_Asentamiento><Delegacion_Municipio>${arrayDomicilio.data.delegacion_municipio}</Delegacion_Municipio><Ciudad_Estado>${arrayDomicilio.data.ciudad_estado}</Ciudad_Estado><Pais>${arrayDomicilio.data.pais === undefined ? '' : arrayDomicilio.data.pais}</Pais><Entre_calle1>${arrayDomicilio.data.calle1 === undefined ? '' : arrayDomicilio.data.calle1}</Entre_calle1><Entre_calle2>${arrayDomicilio.data.calle2 === undefined ? '' : arrayDomicilio.data.calle2}</Entre_calle2><Predeterminado>${arrayDomicilio.data.predeterminado ? 1 : 0}</Predeterminado></Domicilio>`;
            };
            xmlDomicilio += '</Domicilios>';
        };

        Swal.fire({
            title: `¿Quieres guardar los datos de ${this.personaForm.controls.nombre_razon.value}?`,
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Guardar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                let regimen = null;
                if (this.personaForm.controls.idTipoPersona.value === 2 && this.personaForm.controls.idTipoMor.value === 2) {
                    regimen = this.personaForm.controls.regimenFiscal.value;
                };
                let stringPais: string = '';
                for (let pais of this.personaForm.controls.idPais.value) {
                    stringPais += `${pais},`;
                };
                const jsonPersona = {
                    idTipoPersona: this.personaForm.controls.idTipoPersona.value,
                    idTipoMor: this.personaForm.controls.idTipoMor.value,
                    esAccionista: this.personaForm.controls.esAccionista.value ? 1 : 0,
                    rfc_identificacion: this.personaForm.controls.rfc_identificacion.value,
                    nombres_razon: this.personaForm.controls.nombre_razon.value,
                    apellidoPaterno: this.personaForm.controls.apellidoPaterno.value,
                    apellidoMaterno: this.personaForm.controls.apellidoMaterno.value,
                    alias: this.personaForm.controls.alias.value,
                    idPais: this.personaForm.controls.idPais.value[0], //this.personaForm.controls.idPais.value Se coloca 0 ya que se cambia para el multi pais y se manda el string de allPaises
                    fechaNac_constitucion: this.personaForm.controls.fechaNacimiento.value,
                    idSexo: this.personaForm.controls.idSexo.value,
                    curp_registroPob: this.personaForm.controls.curp_registroPob.value,
                    idIdentificacion: this.personaForm.controls.idIdentificacion.value,
                    datoIdentificacion: this.personaForm.controls.datoIdentificacion.value,
                    idEstCivil: this.personaForm.controls.idEstadoCivil.value,
                    idUsuario: this.userData.IdUsuario,
                    IdRegimenFiscal: regimen,
                    AllPaises: stringPais.substring(0, stringPais.length - 1),
                    xmlContacto: xmlCotactos,
                    xmlDomicilio: xmlDomicilio
                };
                this.gaService.postService('personas/insPersona', jsonPersona).subscribe((res: any) => {
                    this.spinner.hide();
                    if (res.err) {
                        this.spinner.hide();
                        Swal.fire({
                            title: '¡Error!',
                            text: res[0][0].Mensaje,
                            icon: 'error',
                            confirmButtonText: 'Cerrar'
                        });
                    } else {
                        if (res[0][0].Codigo >= 1) {
                            this.spinner.hide();
                            Swal.fire({
                                title: '¡Exito!',
                                text: res[0][0].Mensaje,
                                icon: 'success',
                                confirmButtonText: 'Cerrar'
                            });
                            setTimeout(() => {
                                this.addPersona(false);
                            }, 1000);
                        } else {
                            this.spinner.hide();
                            Swal.fire({
                                title: '¡Error!',
                                text: res[0][0].Mensaje,
                                icon: 'error',
                                confirmButtonText: 'Cerrar'
                            });
                        };
                    };
                }, (error: any) => {
                    Swal.fire({
                        title: '¡Error!',
                        text: error.error.text,
                        icon: 'error',
                        confirmButtonText: 'Cerrar'
                    });
                    this.spinner.hide();
                });
            } else if (result.isDenied) {
                Swal.fire({
                    title: '¡Información!',
                    text: 'No se guardo la información',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
            };
        });
    };

    updatePersona = () => {
        if (this.personaForm.invalid) {
            Swal.fire({
                title: '¡Alto!',
                text: 'Completa los campos obligatorios de la persona',
                icon: 'warning',
                confirmButtonText: 'Cerrar'
            });
            this.focusTabs = 0;
            this.personaForm.markAllAsTouched();
            return;
        };

        Swal.fire({
            title: `¿Quieres actualizar los datos de ${this.personaForm.controls.nombre_razon.value}?`,
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Actualizar',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                let regimen = null;
                if (this.personaForm.controls.idTipoPersona.value === 2 && this.personaForm.controls.idTipoMor.value === 2) {
                    regimen = this.personaForm.controls.regimenFiscal.value;
                };
                let stringPais: string = '';
                for (let pais of this.personaForm.controls.idPais.value) {
                    stringPais += `${pais},`;
                };
                const jsonPersona = {
                    IdPersona: this.dataPersonaUpdate.IdPersona,
                    IdTipoPer: this.personaForm.controls.idTipoPersona.value,
                    IdTipoMoral: this.personaForm.controls.idTipoMor.value,
                    EsAccionista: this.personaForm.controls.esAccionista.value ? 1 : 0,
                    RFC: this.personaForm.controls.rfc_identificacion.value === undefined ? '' : this.personaForm.controls.rfc_identificacion.value,
                    Nombre_RazonSocial: this.personaForm.controls.nombre_razon.value === undefined ? '' : this.personaForm.controls.nombre_razon.value,
                    APaterno: this.personaForm.controls.apellidoPaterno.value === undefined ? '' : this.personaForm.controls.apellidoPaterno.value,
                    AMaterno: this.personaForm.controls.apellidoMaterno.value === undefined ? '' : this.personaForm.controls.apellidoMaterno.value,
                    Alias: this.personaForm.controls.alias.value === undefined ? '' : this.personaForm.controls.alias.value,
                    IdPais: this.personaForm.controls.idPais.value[0], //this.personaForm.controls.idPais.value Se coloca 0 ya que se cambia para el multi pais y se manda el string de allPaises
                    Fecha_nacimiento_Constitucion: this.personaForm.controls.fechaNacimiento.value,
                    IdTipoSexo: this.personaForm.controls.idSexo.value,
                    Registro_de_poblacion: this.personaForm.controls.curp_registroPob.value === undefined ? '' : this.personaForm.controls.curp_registroPob.value,
                    IdTipoIdentificacion: this.personaForm.controls.idIdentificacion.value,
                    Identificiacion: this.personaForm.controls.datoIdentificacion.value === undefined ? '' : this.personaForm.controls.datoIdentificacion.value,
                    IdEstadoCivil: this.personaForm.controls.idEstadoCivil.value,
                    idUsuario: this.userData.IdUsuario,
                    IdRegimenFiscal: regimen,
                    AllPaises: stringPais.substring(0, stringPais.length - 1),
                    XMLContacto: null,
                    XMLDomicilio: null
                };

                this.gaService.postService('personas/updPersona', jsonPersona).subscribe((res: any) => {
                    if (res[0][0].Codigo > 0) {
                        this.spinner.hide();
                        Swal.fire({
                            title: '¡Exito!',
                            text: res[0][0].Mensaje,
                            icon: 'success',
                            confirmButtonText: 'Cerrar'
                        });
                        setTimeout(() => {
                            this.addPersona(false);
                        }, 1000);
                    } else {
                        this.spinner.hide();
                        Swal.fire({
                            title: '¡Alto!',
                            text: res[0][0].Mensaje,
                            icon: 'warning',
                            confirmButtonText: 'Cerrar'
                        });
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
                    text: 'No se guardo la información',
                    icon: 'info',
                    confirmButtonText: 'Cerrar'
                });
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
                            Swal.fire({
                                title: '¡Listo!',
                                text: res[0][0].msg,
                                icon: 'success',
                                confirmButtonText: 'Cerrar'
                            });
                            this.getAllPersonas();
                        } else {
                            Swal.fire({
                                title: '¡Alto!',
                                text: res[0][0].msg,
                                icon: 'warning',
                                confirmButtonText: 'Cerrar'
                            });
                            this.getAllPersonas();
                        };
                    });
                } else {
                    Swal.fire({
                        title: '¡Información!',
                        text: 'No se realizo ninguna acción',
                        icon: 'info',
                        confirmButtonText: 'Cerrar'
                    });
                }
            });
        };
    };

    onTabChanged = (e) => {
        if (this.actualizarPersona) {
            if (e.tab.textLabel === 'Datos de persona') {
                this.getDataPersonaById();
            } else if (e.tab.textLabel === 'Medios de contacto') {
                if (this.moralInterna) {
                    this.createGridMoralInterna();
                } else {
                    this.contactosPersonaUpdComponent.getDataContactosPersona();
                    this.contactosPersonaUpdComponent.createGridContactos();
                };
            } else if (e.tab.textLabel === 'Domicilios') {
                this.domiciliosPersonaUpdComponent.getDataDomiciliosPersona();
                this.domiciliosPersonaUpdComponent.createGridDomicilios();
            } else if (e.tab.textLabel === 'Relación familiar') {
                this.relacionFamiliarComponent.getAllRelacionesFamiliares();
            } else if (e.tab.textLabel === 'Expediente digital') {
                this.expedienteDigitalComponent.getAllDocuments();
            };
        };
    };

    showModalContacto = () => {
        this.contactosPersonaUpdComponent.AddContactos()
    };

    showModalDomicilios = () => {
        this.domiciliosPersonaUpdComponent.AddDomicilios()
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

    validaFormsContactos = () => {
        let totalDatoPredeterminadoCelular: number = 0;
        let totalDatoPredeterminadoCorreo: number = 0;
        let totalDatoPredeterminadoTelefono: number = 0;
        const validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.arrayAllContactos.length === 0) {
            return { success: 1, msg: '' }
        } else {
            for (let arrayContacto of this.arrayAllContactos) {
                if (JSON.stringify(arrayContacto.data) === '{}') {
                    return { success: 0, msg: 'Completa los campos obligatorios del contacto' }
                } else {
                    if (arrayContacto.data.predeterminado) {
                        if (arrayContacto.data.idTipCont === 1) {
                            totalDatoPredeterminadoCelular += 1;
                        };
                        if (arrayContacto.data.idTipCont === 2) {
                            totalDatoPredeterminadoCorreo += 1;
                        };
                        if (arrayContacto.data.idTipCont === 3) {
                            totalDatoPredeterminadoTelefono += 1;
                        };
                    };
                    if (arrayContacto.data.idTipCont === null || arrayContacto.data.idTipCont === undefined || arrayContacto.data.idTipCont === 0 || arrayContacto.data.idTipCont === '') {
                        return { success: 0, msg: 'Completa los campos obligatorios del contacto' };
                    };
                    if (arrayContacto.data.dato === null || arrayContacto.data.dato === undefined || arrayContacto.data.dato === '') {
                        return { success: 0, msg: 'Completa los campos obligatorios del contacto' };
                    };
                    if (arrayContacto.data.idTipCont === 2) {
                        if (!arrayContacto.data.dato.match(validRegex)) {
                            return { success: 0, msg: 'Completa los campos obligatorios del contacto' };
                        };
                    };
                };
            };

            if ((totalDatoPredeterminadoCelular + totalDatoPredeterminadoCorreo + totalDatoPredeterminadoTelefono) === 0) {
                return { success: 0, msg: `Debe seleccionar un medio de contacto como predeterminado de los ${this.arrayAllContactos.length} agregados.` };
            };
            if (totalDatoPredeterminadoCelular > 1) {
                return { success: 0, msg: `Solo puede tener 1 celular como medio de contacto como predeterminado.` };
            };
            if (totalDatoPredeterminadoCorreo > 1) {
                return { success: 0, msg: `Solo puede tener 1 correo como medio de contacto como predeterminado.` };
            };
            if (totalDatoPredeterminadoTelefono > 1) {
                return { success: 0, msg: `Solo puede tener 1 Telefono como medio de contacto como predeterminado.` };
            };
            return { success: 1, msg: `` }
        };
    };

    validaFormsDomicilios = () => {
        let totalDomicilioFiscal: number = 0;
        let totalDomiciliosPredeterminadosOficina: number = 0;
        let totalDomiciliosPredeterminadosOtro: number = 0;
        let totalDomiciliosPredeterminadosParticular: number = 0;
        if (this.arrayAllDomicilios.length === 0) {
            return { success: 1, msg: '' };
        } else {
            for (let arrayDomicilio of this.arrayAllDomicilios) {
                if (JSON.stringify(arrayDomicilio.data) === '{}') {
                    return { success: 0, msg: 'Completa los campos obligatorios de los domicilios' };
                } else {
                    if (arrayDomicilio.data.esFiscal) {
                        totalDomicilioFiscal += 1;
                    };
                    if (arrayDomicilio.data.predeterminado) {
                        if (arrayDomicilio.data.idTipDom === 1) {
                            totalDomiciliosPredeterminadosOficina += 1;
                        };
                        if (arrayDomicilio.data.idTipDom === 2) {
                            totalDomiciliosPredeterminadosOtro += 1;
                        };
                        if (arrayDomicilio.data.idTipDom === 3) {
                            totalDomiciliosPredeterminadosParticular += 1;
                        };
                    };
                    if (arrayDomicilio.data.idTipDom === null || arrayDomicilio.data.idTipDom === undefined || arrayDomicilio.data.idTipDom === 0) {
                        return { success: 0, msg: 'Completa los campos obligatorios de los domicilios' };
                    };
                    if (arrayDomicilio.data.calle === null || arrayDomicilio.data.calle === undefined || arrayDomicilio.data.calle === '') {
                        return { success: 0, msg: 'Completa los campos obligatorios de los domicilios' };
                    };
                    if (arrayDomicilio.data.numExt === null || arrayDomicilio.data.numExt === undefined || arrayDomicilio.data.numExt === '') {
                        return { success: 0, msg: 'Completa los campos obligatorios de los domicilios' };
                    };
                    if (arrayDomicilio.data.cp === null || arrayDomicilio.data.cp === undefined || arrayDomicilio.data.cp === '') {
                        return { success: 0, msg: 'Completa los campos obligatorios de los domicilios' };
                    };
                    if (arrayDomicilio.data.colonia_asentamiento === null || arrayDomicilio.data.colonia_asentamiento === undefined || arrayDomicilio.data.colonia_asentamiento === '') {
                        return { success: 0, msg: 'Completa los campos obligatorios de los domicilios' };
                    };
                    if (arrayDomicilio.data.delegacion_municipio === null || arrayDomicilio.data.delegacion_municipio === undefined || arrayDomicilio.data.delegacion_municipio === '') {
                        return { success: 0, msg: 'Completa los campos obligatorios de los domicilios' };
                    };
                    if (arrayDomicilio.data.ciudad_estado === null || arrayDomicilio.data.ciudad_estado === undefined || arrayDomicilio.data.ciudad_estado === '') {
                        return { success: 0, msg: 'Completa los campos obligatorios de los domicilios' };
                    };
                    if (arrayDomicilio.data.pais === null || arrayDomicilio.data.pais === undefined || arrayDomicilio.data.pais === '') {
                        return { success: 0, msg: 'Completa los campos obligatorios de los domicilios' };
                    };
                };
            };

            if (totalDomicilioFiscal === 0) {
                return { success: 0, msg: `Debe seleccionar 1 domicilio fiscal de los ${this.arrayAllDomicilios.length} agregados.` };
            };
            if (totalDomicilioFiscal > 1) {
                return { success: 0, msg: `Solo puede tener 1 domicilio fisca.` };
            };

            if ((totalDomiciliosPredeterminadosOficina + totalDomiciliosPredeterminadosOtro + totalDomiciliosPredeterminadosParticular) === 0) {
                return { success: 0, msg: `Debe seleccionar 1 domicilio como predeterminado.` };
            };
            if ((totalDomiciliosPredeterminadosOficina + totalDomiciliosPredeterminadosOtro + totalDomiciliosPredeterminadosParticular) > 1) {
                return { success: 0, msg: `Solo puede tener 1 domicilio como predeterminado.` };
            };
            return { success: 1, msg: '' };
        };
    };
    /**
    * #REGION VALIDA FORMULARIOS
    */

    /**INICIALIZA VARIABLES DEL FORMULARIO */
    initVarFormPersona = () => {
        //mat-select
        this.personaForm.controls.idTipoPersona.setValue(0);
        this.personaForm.controls.idTipoMor.setValue(0);
        this.personaForm.controls.regimenFiscal.setValue(0);
        this.personaForm.controls.idSexo.setValue(0);
        this.personaForm.controls.idPais.setValue([0]);
        this.personaForm.controls.idIdentificacion.setValue(0);
        this.personaForm.controls.idEstadoCivil.setValue(0);
        //Switch
        this.personaForm.controls.esAccionista.setValue(false);
        //Inputs
        this.personaForm.controls.nombre_razon.setValue('');
        this.personaForm.controls.apellidoPaterno.setValue('');
        this.personaForm.controls.apellidoMaterno.setValue('');
        this.personaForm.controls.alias.setValue('');
        this.personaForm.controls.fechaNacimiento.setValue('');
        this.personaForm.controls.curp_registroPob.setValue('');
        this.personaForm.controls.datoIdentificacion.setValue('');
        this.personaForm.controls.rfc_identificacion.setValue('');
    };
    /**INICIALIZA VARIABLES DEL FORMULARIO */

    /**RESET VARIABLES DE OPCIONES */
    resetVariablesOpciones = () => {
        this.IdTipoMoralOption = [];
        this.IdRegimenOption = []
        this.EsAccionista = [];
        this.RFC = [];
        this.Nombre_RazonSocial = [];
        this.APaterno = [];
        this.AMaterno = [];
        this.Alias = [];
        this.IdPais = [];
        this.Fecha_nacimiento_Constitucion = [];
        this.IdTipoSexo = [];
        this.Registro_de_poblacion = [];
        this.IdTipoIdentificacion = [];
        this.Identificiacion = [];
        this.IdEstadoCivil = [];

        //mat-select
        this.personaForm.controls.idTipoMor.reset();
        this.personaForm.controls.regimenFiscal.reset();
        this.personaForm.controls.idSexo.reset();
        this.personaForm.controls.idPais.reset();
        this.personaForm.controls.idIdentificacion.reset();
        this.personaForm.controls.idEstadoCivil.reset();
        //Switch
        this.personaForm.controls.esAccionista.reset();
        //Inputs
        this.personaForm.controls.nombre_razon.reset();
        this.personaForm.controls.apellidoPaterno.reset();
        this.personaForm.controls.apellidoMaterno.reset();
        this.personaForm.controls.alias.reset();
        this.personaForm.controls.fechaNacimiento.reset();
        this.personaForm.controls.curp_registroPob.reset();
        this.personaForm.controls.datoIdentificacion.reset();
        this.personaForm.controls.rfc_identificacion.reset();

        //mat-select
        this.personaForm.controls.idTipoMor.setValue(0);
        this.personaForm.controls.regimenFiscal.setValue(0);
        this.personaForm.controls.idSexo.setValue(0);
        this.personaForm.controls.idPais.setValue([0]);
        this.personaForm.controls.idIdentificacion.setValue(0);
        this.personaForm.controls.idEstadoCivil.setValue(0);
        //Switch
        this.personaForm.controls.esAccionista.setValue(false);
        //Inputs
        this.personaForm.controls.nombre_razon.setValue('');
        this.personaForm.controls.apellidoPaterno.setValue('');
        this.personaForm.controls.apellidoMaterno.setValue('');
        this.personaForm.controls.alias.setValue('');
        this.personaForm.controls.fechaNacimiento.setValue('');
        this.personaForm.controls.curp_registroPob.setValue('');
        this.personaForm.controls.datoIdentificacion.setValue('');
        this.personaForm.controls.rfc_identificacion.setValue('');
    };
    /**RESET VARIABLES DE OPCIONES */

    /**SET VARIABLES FORMULARIO*/
    setVariablesForm = (dataBd, tipoPersona) => {
        this.arrayAllContactos = [];
        this.arrayAllDomicilios = [];
        for (let data of dataBd) {
            if (data.Campo === 'IdTipoMoral') {
                this.IdTipoMoralOption = data;
            };
            if (data.Campo === 'IdRegimen') {
                this.IdRegimenOption = data;
            };
            if (data.Campo === 'EsAccionista') {
                this.EsAccionista = data;
            };
            if (data.Campo === 'RFC') {
                this.RFC = data;
            };
            if (data.Campo === 'Nombre_RazonSocial') {
                this.Nombre_RazonSocial = data;
            };
            if (data.Campo === 'APaterno') {
                this.APaterno = data;
            };
            if (data.Campo === 'AMaterno') {
                this.AMaterno = data;
            };
            if (data.Campo === 'Alias') {
                this.Alias = data;
            };
            if (data.Campo === 'IdPais') {
                this.IdPais = data;
            };
            if (data.Campo === 'Fecha_nacimiento_Constitucion') {
                this.Fecha_nacimiento_Constitucion = data;
            };
            if (data.Campo === 'IdTipoSexo') {
                this.IdTipoSexo = data;
            };
            if (data.Campo === 'Registro_de_poblacion') {
                this.Registro_de_poblacion = data;
            };
            if (data.Campo === 'IdTipoIdentificacion') {
                this.IdTipoIdentificacion = data;
            };
            if (data.Campo === 'Identificiacion') {
                this.Identificiacion = data;
            };
            if (data.Campo === 'IdEstadoCivil') {
                this.IdEstadoCivil = data;
            };
        };

        this.IdTipoMoralOption?.Obligatorio ? this.personaForm.controls['idTipoMor'].addValidators([Validators.min(1), Validators.required]) : this.personaForm.get('idTipoMor').clearValidators();
        this.personaForm.controls['idTipoMor'].updateValueAndValidity();

        this.personaForm.controls['rfc_identificacion'].clearValidators();
        this.personaForm.controls['rfc_identificacion'].updateValueAndValidity();

        if (tipoPersona === 1) {
            this.rfcMaxLenght = 13;
            this.RFC?.Obligatorio ? this.personaForm.controls['rfc_identificacion'].addValidators([Validators.required, Validators.pattern(REGEX_RFC_FIS)]) : this.personaForm.controls['rfc_identificacion'].clearValidators()
            this.personaForm.controls['rfc_identificacion'].updateValueAndValidity();

            this.personaForm.controls.regimenFiscal.clearValidators();
            this.personaForm.controls.regimenFiscal.updateValueAndValidity();
        };

        if (tipoPersona === 2) {
            this.rfcMaxLenght = 12;
            this.RFC?.Obligatorio ? this.personaForm.controls['rfc_identificacion'].addValidators([Validators.required, Validators.pattern(REGEX_RFC_MOR)]) : this.personaForm.controls['rfc_identificacion'].clearValidators()
            this.personaForm.controls['rfc_identificacion'].updateValueAndValidity();
        };

        this.Nombre_RazonSocial?.Obligatorio ? this.personaForm.controls['nombre_razon'].addValidators([Validators.required]) : this.personaForm.controls['nombre_razon'].clearValidators()
        this.personaForm.controls['nombre_razon'].updateValueAndValidity();

        this.APaterno?.Obligatorio ? this.personaForm.controls['apellidoPaterno'].addValidators([Validators.required]) : this.personaForm.controls['apellidoPaterno'].clearValidators()
        this.personaForm.controls['apellidoPaterno'].updateValueAndValidity();

        this.AMaterno?.Obligatorio ? this.personaForm.controls['apellidoMaterno'].addValidators([Validators.required]) : this.personaForm.controls['apellidoMaterno'].clearValidators()
        this.personaForm.controls['apellidoMaterno'].updateValueAndValidity();

        this.Alias?.Obligatorio ? this.personaForm.controls['alias'].addValidators([Validators.required]) : this.personaForm.controls['alias'].clearValidators()
        this.personaForm.controls['alias'].updateValueAndValidity();

        this.IdPais?.Obligatorio ? this.personaForm.controls['idPais'].addValidators([Validators.min(1), Validators.required]) : this.personaForm.controls['idPais'].clearValidators()
        this.personaForm.controls['idPais'].updateValueAndValidity();

        this.Fecha_nacimiento_Constitucion?.Obligatorio ? this.personaForm.controls['fechaNacimiento'].addValidators(Validators.required) : this.personaForm.controls['fechaNacimiento'].clearValidators()
        this.personaForm.controls['fechaNacimiento'].updateValueAndValidity();

        this.IdTipoSexo?.Obligatorio ? this.personaForm.controls['idSexo'].addValidators([Validators.min(1), Validators.required]) : this.personaForm.controls['idSexo'].clearValidators()
        this.personaForm.controls['idSexo'].updateValueAndValidity();

        this.Registro_de_poblacion?.Obligatorio ? this.personaForm.controls['curp_registroPob'].addValidators([Validators.required]) : this.personaForm.controls['curp_registroPob'].clearValidators()
        this.personaForm.controls['curp_registroPob'].updateValueAndValidity();

        this.IdTipoIdentificacion?.Obligatorio ? this.personaForm.controls['idIdentificacion'].addValidators([Validators.min(1), Validators.required]) : this.personaForm.controls['idIdentificacion'].clearValidators()
        this.personaForm.controls['idIdentificacion'].updateValueAndValidity();

        this.Identificiacion?.Obligatorio ? this.personaForm.controls['datoIdentificacion'].addValidators([Validators.required]) : this.personaForm.controls['datoIdentificacion'].clearValidators()
        this.personaForm.controls['datoIdentificacion'].updateValueAndValidity();

        this.IdEstadoCivil?.Obligatorio ? this.personaForm.controls['idEstadoCivil'].addValidators([Validators.min(1), Validators.required]) : this.personaForm.controls['idEstadoCivil'].clearValidators()
        this.personaForm.controls['idEstadoCivil'].updateValueAndValidity();

        if (!this.actualizarPersona) {
            /**Agregamos el array para los contactos */
            this.currentIdContacto = `${this.stringIdContacto}${this.arrayAllContactos.length + 1}`;
            this.arrayAllContactos.push({ id: this.currentIdContacto, data: {} });
            /**Agregamos el array para los contactos */
            /**Agregamos el array para los domicilios */
            this.currentIdDomicilios = `${this.stringIdDomicilio}${this.arrayAllDomicilios.length + 1}`;
            this.arrayAllDomicilios.push({ id: this.currentIdDomicilios, data: {} });
            /**Agregamos el array para los domicilios */
        };

    };

    FechaDiaCorrecto(fecha) {
        return new Date(new Date(fecha).getTime() + new Date(fecha).getTimezoneOffset() * 60000)
    };

    //#region CREA GRIDS

    createGrid = () => {
        this.toolbar = [];
        this.columns = [
            {
                caption: 'RFC',
                dataField: 'RFC'
            },
            {
                caption: 'Nombre / Razón',
                dataField: 'Nombre'
            },
            {
                caption: 'Tipo de persona',
                dataField: 'TipoPer'
            },
            {
                caption: 'Tipo de empresa',
                dataField: 'TipoMor'
            },
            {
                caption: 'Es accionista',
                dataField: 'EsAccionista'
            },
            {
                caption: 'Alias',
                dataField: 'Alias'
            },
            {
                caption: 'Editar',
                allowEditing: false,
                cellTemplate: 'crudPersonas'
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
        this.muestraGrid = true;
    };

    createGridMoralInterna = () => {
        this.muestraGridMoralInterna = false;
        this.toolbarMoralInterna = [];
        this.columnsMoralInterna = [

            {
                caption: 'Puesto',
                dataField: 'Puesto'
            },
            {
                caption: 'Nombre',
                dataField: 'Nombre'
            },
            {
                caption: 'Tipo de contacto',
                dataField: 'Descripcion'
            },
            {
                caption: 'Dato',
                dataField: 'Dato'
            },
            {
                caption: 'Extensión',
                dataField: 'Ext'
            }
        ];
        /*
            Parametros de Paginacion de Grit
            */

        this.gridOptionsMoralInterna = { paginacion: 10, pageSize: [20, 40, 80, 100] };

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
        this.muestraGridMoralInterna = true;
    };

    //#endregion CREA GRIDS
};
