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
                    this.arrayIdDomicilio = key;
                };
            });
            this.arrayAllDomicilios[this.arrayIdDomicilio].data = res;
            this.removeDivError(this.arrayIdDomicilio);
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
        setTimeout(async () => {
            for (let domicilio of this.arrayAllDomicilios) {
                /**DIV QUE SE ENBEBE */
                let idDivTipoDom = `${domicilio.id}_div_tipoDom`;
                let idDivCalle = `${domicilio.id}_div_calle`;
                let idDivNumExt = `${domicilio.id}_div_numExt`;
                let idDivCp = `${domicilio.id}_div_cp`;
                let idDivColonia_asentamiento = `${domicilio.id}_div_colonia_asentamiento`;
                let idDivDelegacion_municipio = `${domicilio.id}_div_delegacion_municipio`;
                let idDivCiudad_estado = `${domicilio.id}_div_ciudad_estado`;
                /**PADRE EN DONDE SE EMBEBE */
                let idPadreValidFormTipoDom = `${domicilio.id}_tipoDom`;
                let idPadreValidFormCalle = `${domicilio.id}_calle`;
                let idPadreValidFormNumExt = `${domicilio.id}_numExt`;
                let idPadreValidFormCp = `${domicilio.id}_cp`;
                let idPadreValidFormColonia_asentamiento = `${domicilio.id}_colonia_asentamiento`;
                let idPadreValidFormDelegacion_municipio = `${domicilio.id}_delegacion_municipio`;
                let idPadreValidFormCiudad_estado = `${domicilio.id}_ciudad_estado`;
                /**ADD CSS CLAS ANGULAR */
                let idComponentPadreValidFormTipoDom = `${domicilio.id}_tipoDom_component`;
                let idComponentPadreValidFormCalle = `${domicilio.id}_calle_component`;
                let idComponentPadreValidFormNumExt = `${domicilio.id}_numExt_component`;
                let idComponentPadreValidFormCp = `${domicilio.id}_cp_component`;
                let idComponentPadreValidFormColonia_asentamiento = `${domicilio.id}_colonia_asentamiento_component`;
                let idComponentPadreValidFormDelegacion_municipio = `${domicilio.id}_delegacion_municipio_component`;
                let idComponentPadreValidFormCiudad_estado = `${domicilio.id}_ciudad_estado_component`;

                if (document.getElementById(idDivTipoDom)) {
                    document.getElementById(idDivTipoDom).remove();
                };
                if (document.getElementById(idDivCalle)) {
                    document.getElementById(idDivCalle).remove();
                };
                if (document.getElementById(idDivNumExt)) {
                    document.getElementById(idDivNumExt).remove();
                };
                if (document.getElementById(idDivCp)) {
                    document.getElementById(idDivCp).remove();
                };
                if (document.getElementById(idDivColonia_asentamiento)) {
                    document.getElementById(idDivColonia_asentamiento).remove();
                };
                if (document.getElementById(idDivDelegacion_municipio)) {
                    document.getElementById(idDivDelegacion_municipio).remove();
                };
                if (document.getElementById(idDivCiudad_estado)) {
                    document.getElementById(idDivCiudad_estado).remove();
                };

                if (JSON.stringify(domicilio.data) === '{}') {
                    await this.createAndEmbebedDivError(idDivTipoDom, idPadreValidFormTipoDom, idComponentPadreValidFormTipoDom, 'Selecciona el tipo de domicilio');
                    await this.createAndEmbebedDivError(idDivCalle, idPadreValidFormCalle, idComponentPadreValidFormCalle, 'Ingresa la calle');
                    await this.createAndEmbebedDivError(idDivNumExt, idPadreValidFormNumExt, idComponentPadreValidFormNumExt, 'Selecciona el numero exteriror');
                    await this.createAndEmbebedDivError(idDivCp, idPadreValidFormCp, idComponentPadreValidFormCp, 'Ingresa el codigo postal');
                    await this.createAndEmbebedDivError(idDivColonia_asentamiento, idPadreValidFormColonia_asentamiento, idComponentPadreValidFormColonia_asentamiento, 'Ingresa la colonia');
                    await this.createAndEmbebedDivError(idDivDelegacion_municipio, idPadreValidFormDelegacion_municipio, idComponentPadreValidFormDelegacion_municipio, 'Ingresa la delegacion');
                    await this.createAndEmbebedDivError(idDivCiudad_estado, idPadreValidFormCiudad_estado, idComponentPadreValidFormCiudad_estado, 'Selecciona la ciudad');
                } else {
                    if (domicilio.data.idTipDom === null || domicilio.data.idTipDom === undefined || domicilio.data.idTipDom === 0) {
                        await this.createAndEmbebedDivError(idDivTipoDom, idPadreValidFormTipoDom, idComponentPadreValidFormTipoDom, 'Selecciona el tipo de domicilio');
                    };
                    if (domicilio.data.calle === null || domicilio.data.calle === undefined || domicilio.data.calle === '') {
                        await this.createAndEmbebedDivError(idDivCalle, idPadreValidFormCalle, idComponentPadreValidFormCalle, 'Ingresa la calle');
                    };
                    if (domicilio.data.numExt === null || domicilio.data.numExt === undefined || domicilio.data.numExt === '') {
                        await this.createAndEmbebedDivError(idDivNumExt, idPadreValidFormNumExt, idComponentPadreValidFormNumExt, 'Selecciona el numero exteriror');
                    };
                    if (domicilio.data.cp === null || domicilio.data.cp === undefined || domicilio.data.cp === '') {
                        await this.createAndEmbebedDivError(idDivCp, idPadreValidFormCp, idComponentPadreValidFormCp, 'Ingresa el codigo postal');
                    };
                    if (domicilio.data.colonia_asentamiento === null || domicilio.data.colonia_asentamiento === undefined || domicilio.data.colonia_asentamiento === '') {
                        await this.createAndEmbebedDivError(idDivColonia_asentamiento, idPadreValidFormColonia_asentamiento, idComponentPadreValidFormColonia_asentamiento, 'Ingresa la colonia');
                    };
                    if (domicilio.data.delegacion_municipio === null || domicilio.data.delegacion_municipio === undefined || domicilio.data.delegacion_municipio === '') {
                        await this.createAndEmbebedDivError(idDivDelegacion_municipio, idPadreValidFormDelegacion_municipio, idComponentPadreValidFormDelegacion_municipio, 'Ingresa la delegacion');
                    };
                    if (domicilio.data.ciudad_estado === null || domicilio.data.ciudad_estado === undefined || domicilio.data.ciudad_estado === '') {
                        await this.createAndEmbebedDivError(idDivCiudad_estado, idPadreValidFormCiudad_estado, idComponentPadreValidFormCiudad_estado, 'Selecciona la ciudad');
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
        let component = this.arrayAllDomicilios[idComponent];
        /**DIV QUE SE ENBEBE */
        let idDivTipoDom = `${component.id}_div_tipoDom`;
        let idDivCalle = `${component.id}_div_calle`;
        let idDivNumExt = `${component.id}_div_numExt`;
        let idDivCp = `${component.id}_div_cp`;
        let idDivColonia_asentamiento = `${component.id}_div_colonia_asentamiento`;
        let idDivDelegacion_municipio = `${component.id}_div_delegacion_municipio`;
        let idDivCiudad_estado = `${component.id}_div_ciudad_estado`;
        /**ADD CSS CLAS ANGULAR */
        let idComponentPadreValidFormTipoDom = `${component.id}_tipoDom_component`;
        let idComponentPadreValidFormCalle = `${component.id}_calle_component`;
        let idComponentPadreValidFormNumExt = `${component.id}_numExt_component`;
        let idComponentPadreValidFormCp = `${component.id}_cp_component`;
        let idComponentPadreValidFormColonia_asentamiento = `${component.id}_colonia_asentamiento_component`;
        let idComponentPadreValidFormDelegacion_municipio = `${component.id}_delegacion_municipio_component`;
        let idComponentPadreValidFormCiudad_estado = `${component.id}_ciudad_estado_component`;

        if (component.data.idTipDom === null || component.data.idTipDom === undefined || component.data.idTipDom === 0) {
        } else {
            let dynamicIdDivTipoDom = document.getElementById(idDivTipoDom);
            if (dynamicIdDivTipoDom) {
                dynamicIdDivTipoDom.remove();
            };
            let dynamicIdComponentPadreValidFormTipoDom = document.getElementById(idComponentPadreValidFormTipoDom);
            dynamicIdComponentPadreValidFormTipoDom.classList.remove('mat-form-field-invalid');
            dynamicIdComponentPadreValidFormTipoDom.classList.remove('ng-touched');
        };
        if (component.data.calle === null || component.data.calle === undefined || component.data.calle === '') {
        } else {
            let dynamicIdDivCalle = document.getElementById(idDivCalle);
            if (dynamicIdDivCalle) {
                dynamicIdDivCalle.remove();
            };
            let dynamicIdComponentPadreValidFormCalle = document.getElementById(idComponentPadreValidFormCalle);
            dynamicIdComponentPadreValidFormCalle.classList.remove('mat-form-field-invalid');
            dynamicIdComponentPadreValidFormCalle.classList.remove('ng-touched');
        };
        if (component.data.numExt === null || component.data.numExt === undefined || component.data.numExt === '') {
        } else {
            let dynamicIdDivNumExt = document.getElementById(idDivNumExt);
            if (dynamicIdDivNumExt) {
                dynamicIdDivNumExt.remove();
            };
            let dynamicIdComponentPadreValidFormNumExt = document.getElementById(idComponentPadreValidFormNumExt);
            dynamicIdComponentPadreValidFormNumExt.classList.remove('mat-form-field-invalid');
            dynamicIdComponentPadreValidFormNumExt.classList.remove('ng-touched');
        };
        if (component.data.cp === null || component.data.cp === undefined || component.data.cp === '') {
        } else {
            let dynamicIdDivCp = document.getElementById(idDivCp);
            if (dynamicIdDivCp) {
                dynamicIdDivCp.remove();
            };
            let dynamicIdComponentPadreValidFormCp = document.getElementById(idComponentPadreValidFormCp);
            dynamicIdComponentPadreValidFormCp.classList.remove('mat-form-field-invalid');
            dynamicIdComponentPadreValidFormCp.classList.remove('ng-touched');
        };
        if (component.data.colonia_asentamiento === null || component.data.colonia_asentamiento === undefined || component.data.colonia_asentamiento === '') {
        } else {
            let dynamicIdDivColonia_asentamiento = document.getElementById(idDivColonia_asentamiento);
            if (dynamicIdDivColonia_asentamiento) {
                dynamicIdDivColonia_asentamiento.remove();
            };
            let dynamicIdComponentPadreValidFormColonia_asentamiento = document.getElementById(idComponentPadreValidFormColonia_asentamiento);
            dynamicIdComponentPadreValidFormColonia_asentamiento.classList.remove('mat-form-field-invalid');
            dynamicIdComponentPadreValidFormColonia_asentamiento.classList.remove('ng-touched');
        };
        if (component.data.delegacion_municipio === null || component.data.delegacion_municipio === undefined || component.data.delegacion_municipio === '') {
        } else {
            let dynamicIdDivDelegacion_municipio = document.getElementById(idDivDelegacion_municipio);
            if (dynamicIdDivDelegacion_municipio) {
                dynamicIdDivDelegacion_municipio.remove();
            };
            let dynamicIdComponentPadreValidFormDelegacion_municipio = document.getElementById(idComponentPadreValidFormDelegacion_municipio);
            dynamicIdComponentPadreValidFormDelegacion_municipio.classList.remove('mat-form-field-invalid');
            dynamicIdComponentPadreValidFormDelegacion_municipio.classList.remove('ng-touched');
        };
        if (component.data.ciudad_estado === null || component.data.ciudad_estado === undefined || component.data.ciudad_estado === '') {
        } else {
            let dynamicIdDivCiudad_estado = document.getElementById(idDivCiudad_estado);
            if (dynamicIdDivCiudad_estado) {
                dynamicIdDivCiudad_estado.remove();
            };
            let dynamicIdComponentPadreValidFormCiudad_estado = document.getElementById(idComponentPadreValidFormCiudad_estado);
            dynamicIdComponentPadreValidFormCiudad_estado.classList.remove('mat-form-field-invalid');
            dynamicIdComponentPadreValidFormCiudad_estado.classList.remove('ng-touched');
        };
    };

    redirect(url: string) {
        this.router.navigateByUrl(url);
    };
};
