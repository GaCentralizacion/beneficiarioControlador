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

    contactosPersonaForm = new FormGroup({
        idTipCont: new FormControl(''),
        dato: new FormControl(''),
        predeterminado: new FormControl(false),
        ext: new FormControl('')
    });

    idContacto: string;
    arrayIdContacto: number;
    stringIdContacto: string = 'contacto_';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
    ) {

    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.idContacto = `${this.stringIdContacto}${this.currentIdContacto}`;
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

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
