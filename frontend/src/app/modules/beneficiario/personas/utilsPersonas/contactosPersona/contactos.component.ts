import { Component, OnInit, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { promises, resolve } from 'dns';

const VALID_REGEX_MAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const VALID_REGEX_NUMBER = /^[0-9]{10}$/;

@Component({
    selector: 'app-contactos',
    templateUrl: './contactos.component.html',
    styleUrls: ['./contactos.component.scss']
})

export class ContactosComponent implements OnInit, OnDestroy {
    /**INPUTUS OUTPUTS */
    @Input() catTipoContacto: any[];
    @Input() arrayAllContactos: any[];
    @Input() currentIdContacto: number;
    @Input() actualizarPersona: boolean;
    /**INPUTUS OUTPUTS */

    contactosPersonaForm: FormGroup;

    idContacto: string;
    arrayIdContacto: number;
    stringIdContacto: string = 'contacto_';
    validaFormTipo: string = '';
    validaFormDato: string = '';
    validaFormEmail: string = '';
    datoType: string = 'text'
    datoPlaceHolder: string = ''

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
    ) { }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {

        this.idContacto = `${this.stringIdContacto}${this.currentIdContacto}`;
        this.validaFormTipo = `${this.stringIdContacto}${this.currentIdContacto}_tipo`;
        this.validaFormDato = `${this.stringIdContacto}${this.currentIdContacto}_dato`;

        this.contactosPersonaForm = this._formBuilder.group({
            idTipCont: [0, Validators.min(1)],
            dato: ['', Validators.required],
            predeterminado: true,
            ext: '',
            personaContactar: ''
        });

        if (this.actualizarPersona) {
            this.setDataForm(this.idContacto);
        };

        this.contactosPersonaForm.valueChanges.subscribe(res => {
            this.arrayAllContactos.forEach((value, key) => {
                if (value.id === this.idContacto) {
                    this.arrayIdContacto = key;
                };
            });
            this.arrayAllContactos[this.arrayIdContacto].data = res;
            this.removeDivError(this.arrayIdContacto);
        });
    };

    setDataForm = currentIdContacto => {
        for (let contacto of this.arrayAllContactos) {
            if (currentIdContacto === contacto?.id) {
                this.contactosPersonaForm.controls.idTipCont.setValue(contacto.data?.idTipCont !== '' ? contacto.data?.idTipCont : 0);
                this.contactosPersonaForm.controls.dato.setValue(contacto.data?.dato !== '' ? contacto.data?.dato : '');
                this.contactosPersonaForm.controls.predeterminado.setValue(contacto.data?.predeterminado);
                this.contactosPersonaForm.controls.ext.setValue(contacto.data?.ext);
                this.contactosPersonaForm.controls.personaContactar.setValue(contacto.data?.personaContactar);
            };
        };
    };

    selectContacto = e => {
        this.contactosPersonaForm.controls.dato.setValue('');
        this.datoPlaceHolder = '';
        if (e === 2) {
            this.datoType = 'text';
            this.datoPlaceHolder = 'Email';
        } else {
            this.datoType = 'number';
            this.datoPlaceHolder = 'Número';
        };
    };

    setManualError = () => {
        setTimeout(async () => {
            for (let contacto of this.arrayAllContactos) {
                let idDivTipo = `${contacto.id}_divTipo`;
                let idDivDato = `${contacto.id}_divDato`;
                let idPadreTipo = `${contacto.id}_tipo`;
                let idPadreDato = `${contacto.id}_dato`;
                let idComponentPadreTipo = `${contacto.id}_tipo_component`;
                let idComponentPadreDato = `${contacto.id}_dato_component`;

                if (document.getElementById(idDivTipo)) {
                    document.getElementById(idDivTipo).remove();
                };
                if (document.getElementById(idDivDato)) {
                    document.getElementById(idDivDato).remove();
                };

                if (JSON.stringify(contacto.data) === '{}') {
                    await this.createAndEmbebedDivError(idDivTipo, idPadreTipo, idComponentPadreTipo, 'Selecciona el tipo de contacto');
                    await this.createAndEmbebedDivError(idDivDato, idPadreDato, idComponentPadreDato, 'Ingresa el dato');
                } else {
                    if (contacto.data.idTipCont === 0 || contacto.data.idTipCont === undefined || contacto.data.idTipCont === null) {
                        await this.createAndEmbebedDivError(idDivTipo, `${contacto.id}_tipo`, idComponentPadreTipo, 'Selecciona el tipo de contacto');
                    };

                    if (contacto.data.dato === '' || contacto.data.dato === undefined || contacto.data.dato === null) {
                        if (contacto.data.idTipCont === 0) {
                            await this.createAndEmbebedDivError(idDivDato, `${contacto.id}_dato`, idComponentPadreDato, 'Ingresa un dato');
                        } else if (contacto.data.idTipCont === 2) {
                            await this.createAndEmbebedDivError(idDivDato, `${contacto.id}_dato`, idComponentPadreDato, 'Ingresa el email');
                        } else {
                            await this.createAndEmbebedDivError(idDivDato, `${contacto.id}_dato`, idComponentPadreDato, 'Ingresa el número');
                        }
                    };

                    if (contacto.data.idTipCont === 2) {
                        if (contacto.data.dato === '' || contacto.data.dato === undefined || contacto.data.dato === null) {
                        } else {
                            if (!contacto.data.dato.match(VALID_REGEX_MAIL)) {
                                await this.createAndEmbebedDivError(idDivDato, idPadreDato, idComponentPadreDato, 'Ingresa un email valido');
                            };
                        };
                    };

                    if (contacto.data.idTipCont === 1 || contacto.data.idTipCont === 3) {
                        if (contacto.data.dato === '' || contacto.data.dato === undefined || contacto.data.dato === null) {
                        } else {
                            if (!contacto.data.dato.match(VALID_REGEX_NUMBER)) {
                                await this.createAndEmbebedDivError(idDivDato, idPadreDato, idComponentPadreDato, 'Ingresa un número de 10 dígitos');
                            };
                        };
                    };
                };
            };
        }, 50);
    };

    createAndEmbebedDivError = (idDiv, idPadre, componentePadre, textDiv) => {
        return new Promise(resolve => {
            //agregamos el texto bajo el div
            const errorDiv = document.createElement('div');
            errorDiv.setAttribute('id', idDiv);
            errorDiv.style.marginTop = "-17px";
            errorDiv.style.fontSize = "13px";
            errorDiv.style.color = "#DC2626";
            errorDiv.textContent = textDiv;
            let element = document.getElementById(idPadre);
            element.appendChild(errorDiv);

            //Agregamos para que se va el pintado
            let component = document.getElementById(componentePadre)
            component.classList.add('mat-form-field-invalid');
            component.classList.add('ng-touched');

            resolve({ success: 1 })
        });
    };

    removeDivError = idComponent => {
        let component = this.arrayAllContactos[idComponent];
        let idDivTipo = `${component.id}_divTipo`;
        let idDivDato = `${component.id}_divDato`;
        let idComponentPadreTipo = `${component.id}_tipo_component`;
        let idComponentPadreDato = `${component.id}_dato_component`;
        console
        if (component.data.idTipCont === 0 || component.data.idTipCont === undefined || component.data.idTipCont === null) {
        } else {
            let dynamicDivTipo = document.getElementById(idDivTipo);
            if (dynamicDivTipo) {
                dynamicDivTipo.remove();
            };
            let dinamicIdComponentPadreTipo = document.getElementById(idComponentPadreTipo);
            dinamicIdComponentPadreTipo.classList.remove('mat-form-field-invalid');
            dinamicIdComponentPadreTipo.classList.remove('ng-touched');
        };
        if (component.data.dato === '' || component.data.dato === undefined || component.data.dato === null) {
        } else {
            let dynamicDivDato = document.getElementById(idDivDato);
            if (dynamicDivDato) {
                dynamicDivDato.remove();
            };
            let dinamicIdComponentPadreDato = document.getElementById(idComponentPadreDato);
            dinamicIdComponentPadreDato.classList.remove('mat-form-field-invalid');
            dinamicIdComponentPadreDato.classList.remove('ng-touched');
        };
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
