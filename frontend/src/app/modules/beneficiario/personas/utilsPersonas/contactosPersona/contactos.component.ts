import { Component, OnInit, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { promises, resolve } from 'dns';

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
            predeterminado: false,
            ext: ''
        });

        if (this.actualizarPersona) {
            this.setDataForm(this.idContacto);
        };

        this.contactosPersonaForm.valueChanges.subscribe(res => {
            this.arrayAllContactos.forEach((value, key) => {
                if (value.id === this.idContacto) {
                    let element = document.getElementById(this.idContacto);
                    element.classList.remove('errorForm');
                    let dynamicDiv = document.getElementById('divError');
                    if (dynamicDiv) {
                        dynamicDiv.remove();
                    };
                    this.arrayIdContacto = key;
                };
            });
            this.arrayAllContactos[this.arrayIdContacto].data = res;
        });
    };

    setDataForm = currentIdContacto => {
        for (let contacto of this.arrayAllContactos) {
            if (currentIdContacto === contacto?.id) {
                this.contactosPersonaForm.controls.idTipCont.setValue(contacto.data?.idTipCont !== '' ? contacto.data?.idTipCont : 0);
                this.contactosPersonaForm.controls.dato.setValue(contacto.data?.dato !== '' ? contacto.data?.dato : '');
                this.contactosPersonaForm.controls.predeterminado.setValue(contacto.data?.predeterminado === 1 ? true : false);
                this.contactosPersonaForm.controls.ext.setValue(contacto.data?.ext);
            };
        };
    };

    setManualError = (currentIdContacto, idError, textDiv) => {
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
                        await this.createAndEmbebedDivError(idDivDato, `${contacto.id}_dato`, idComponentPadreDato, 'Ingresa el dato');
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

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
