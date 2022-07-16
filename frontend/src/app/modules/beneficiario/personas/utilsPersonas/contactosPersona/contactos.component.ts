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
    /**IMPUTUS OUTPUTS */
    @Input() catTipoContacto: any[];
    @Input() arrayAllContactos: any[];
    @Input() currentIdContacto: number;
    /**IMPUTUS OUTPUTS */

    contactosPersonaForm = new FormGroup({
        idTipoContacto: new FormControl(''),
        dato: new FormControl(''),
        predeterminado: new FormControl(false),
        ext: new FormControl('')
    });

    idContacto: string;
    arrayIdContacto: number;

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
        this.idContacto = `contacto_${this.currentIdContacto}`;
        this.contactosPersonaForm.valueChanges.subscribe(res => {
            this.arrayAllContactos.forEach((value, key) => {
                if (value.id === this.idContacto) {
                    this.arrayIdContacto = key;
                };
            });
            this.arrayAllContactos[this.arrayIdContacto].data = res;
        });
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
