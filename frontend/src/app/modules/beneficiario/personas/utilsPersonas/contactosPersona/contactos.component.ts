import { Component, OnInit, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';

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
            idTipCont: (['', Validators.required]),
            dato: (['', Validators.required]),
            predeterminado: (false),
            ext: ('')
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
        if (document.getElementById('divError')) {
            document.getElementById('divError').remove();
        };
        let element = document.getElementById(currentIdContacto);
        element.classList.add('errorForm');
        if (idError !== '') {
            if (!document.getElementById('divError')) {
                const errorDiv = document.createElement('div');
                errorDiv.setAttribute('id', 'divError');
                errorDiv.style.marginTop = "-17px";
                errorDiv.style.fontSize = "13px";
                errorDiv.style.color = "#DC2626";
                errorDiv.textContent = textDiv;
                let elementTipo = document.getElementById(idError);
                elementTipo.appendChild(errorDiv);
            };
        };
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
