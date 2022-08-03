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

    domicilioPersonaForm: FormGroup;

    idDomicilio: string;
    arrayIdDomicilio: number;
    stringIdDomicilio: string = 'domicilio_';

    validFormTipoDom: string = '';
    validFormCalle: string = '';
    validFormNumExt: string = '';
    validFormCp: string = '';
    validFormColonia_asentamiento: string = '';
    validFormDelegacion_municipio: string = '';
    validFormCiudad_estado: string = '';

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
        this.domicilioPersonaForm = this._formBuilder.group({
            idTipDom: [0, Validators.min(1)],
            esFiscal: false,
            calle: ['', Validators.required],
            numExt: ['', Validators.required],
            numInt: [''],
            cp: ['', Validators.required],
            colonia_asentamiento: ['', Validators.required],
            delegacion_municipio: ['', Validators.required],
            ciudad_estado: ['', Validators.required],
            pais: ['', Validators.required],
            calle1: [''],
            calle2: ['']
        });

        this.idDomicilio = `${this.stringIdDomicilio}${this.currentIdDomicilio}`;

        this.validFormTipoDom = `${this.stringIdDomicilio}${this.currentIdDomicilio}_tipoDom`;
        this.validFormCalle = `${this.stringIdDomicilio}${this.currentIdDomicilio}_calle`;
        this.validFormNumExt = `${this.stringIdDomicilio}${this.currentIdDomicilio}_numExt`;
        this.validFormCp = `${this.stringIdDomicilio}${this.currentIdDomicilio}_cp`;
        this.validFormColonia_asentamiento = `${this.stringIdDomicilio}${this.currentIdDomicilio}_colonia_asentamiento`;
        this.validFormDelegacion_municipio = `${this.stringIdDomicilio}${this.currentIdDomicilio}_delegacion_municipio`;
        this.validFormCiudad_estado = `${this.stringIdDomicilio}${this.currentIdDomicilio}_ciudad_estado`;

        if (this.actualizarPersona) {
            this.setDataForm(this.idDomicilio);
        };
        this.domicilioPersonaForm.valueChanges.subscribe(res => {
            this.arrayAllDomicilios.forEach((value, key) => {
                if (value.id === this.idDomicilio) {
                    let element = document.getElementById(this.idDomicilio);
                    element.classList.remove('errorForm');
                    let dynamicDiv = document.getElementById('divError');
                    if (dynamicDiv) {
                        dynamicDiv.remove();
                    };
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

    setManualError = (currentIdDomicilio, idError, textDiv) => {
        setTimeout(() => {
            if (document.getElementById('divError')) {
                document.getElementById('divError').remove();
            };
            let element = document.getElementById(currentIdDomicilio);
            if (element) {
                element.classList.add('errorForm');
            };
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
        }, 50);
    };


    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
