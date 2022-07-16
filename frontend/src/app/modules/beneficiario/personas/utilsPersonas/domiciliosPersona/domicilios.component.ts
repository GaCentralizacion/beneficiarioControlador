import { Component, OnInit, ViewChild, OnDestroy, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

@Component({
    selector: 'app-domicilios',
    templateUrl: './domicilios.component.html',
    styleUrls: ['./domicilios.component.scss']
})

export class DomiciliosComponent implements OnInit, OnDestroy {
    @Input() catTipoDomicilio: any[]
    @Input() arrayAllDomicilios: any[]
    @Input() currentIdDomicilio: number;

    domicilioPersonaForm = new FormGroup({
        idTipoDomicilio: new FormControl(0),
        esFiscal: new FormControl(false),
        calle: new FormControl(''),
        numExt: new FormControl(''),
        numInt: new FormControl(''),
        cp: new FormControl(''),
        colonia_asentamiento: new FormControl(''),
        delegacion_municipio: new FormControl(''),
        ciudad_estado: new FormControl(''),
        pais: new FormControl(''),
        calle1: new FormControl(''),
        calle2: new FormControl('')
    });

    idDomicilio: String;
    arrayIdDomicilio: number;

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
        this.idDomicilio = `domicilio_${this.currentIdDomicilio}`;
        this.domicilioPersonaForm.valueChanges.subscribe(res => {
            this.arrayAllDomicilios.forEach((value, key) => {
                if (value.id === this.idDomicilio) {
                    this.arrayIdDomicilio = key;
                };
            });
            this.arrayAllDomicilios[this.arrayIdDomicilio].data = res;
        });
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
