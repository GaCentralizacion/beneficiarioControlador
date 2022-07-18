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
    /**INPUTUS OUTPUTS */
    @Input() catTipoDomicilio: any[]
    @Input() arrayAllDomicilios: any[]
    @Input() currentIdDomicilio: number;
    @Input() actualizarPersona: boolean;
    /**INPUTUS OUTPUTS */

    domicilioPersonaForm = new FormGroup({
        idTipDom: new FormControl(0),
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

    idDomicilio: string;
    arrayIdDomicilio: number;
    stringIdDomicilio: string = 'domicilio_';

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
        this.idDomicilio = `${this.stringIdDomicilio}${this.currentIdDomicilio}`;
        if (this.actualizarPersona) {
            this.setDataForm(this.idDomicilio);
        };
        this.domicilioPersonaForm.valueChanges.subscribe(res => {
            this.arrayAllDomicilios.forEach((value, key) => {
                if (value.id === this.idDomicilio) {
                    this.arrayIdDomicilio = key;
                };
            });
            this.arrayAllDomicilios[this.arrayIdDomicilio].data = res;
        });
    };

    setDataForm = currentIdDomicilio => {
        for (let domicilio of this.arrayAllDomicilios) {
            if (currentIdDomicilio === domicilio?.id) {
                this.domicilioPersonaForm.controls.idTipDom.setValue(domicilio.data?.idTipDom)
                this.domicilioPersonaForm.controls.esFiscal.setValue(domicilio.data?.esFiscal)
                this.domicilioPersonaForm.controls.calle.setValue(domicilio.data?.calle)
                this.domicilioPersonaForm.controls.numExt.setValue(domicilio.data?.numExt)
                this.domicilioPersonaForm.controls.numInt.setValue(domicilio.data?.numInt)
                this.domicilioPersonaForm.controls.cp.setValue(domicilio.data?.cp)
                this.domicilioPersonaForm.controls.colonia_asentamiento.setValue(domicilio.data?.colonia_asentamiento)
                this.domicilioPersonaForm.controls.delegacion_municipio.setValue(domicilio.data?.delegacion_municipio)
                this.domicilioPersonaForm.controls.ciudad_estado.setValue(domicilio.data?.ciudad_estado)
                this.domicilioPersonaForm.controls.pais.setValue(domicilio.data?.pais)
                this.domicilioPersonaForm.controls.calle1.setValue(domicilio.data?.calle1)
                this.domicilioPersonaForm.controls.calle2.setValue(domicilio.data?.calle2)
            };
        };
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
