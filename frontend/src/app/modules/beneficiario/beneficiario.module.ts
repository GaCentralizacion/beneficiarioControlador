import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { BeneficiarioRoutingModule } from './beneficiario-routing.module';
import { SharedModule } from 'app/shared/shared.module';

/** IMPORT COMPONENTS */
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccionistaComponent } from './accionista/accionista.component';
import { SeriesComponent } from './series/series.component';
import { PersonasComponent } from './personas/personas.component';
import { ContactosComponent } from './personas/utilsPersonas/contactosPersona/contactos.component';
import { DomiciliosComponent } from './personas/utilsPersonas/domiciliosPersona/domicilios.component';
import { RelacionFamiliarComponent } from './personas/utilsPersonas/relacionFamiliar/relacionFamiliar.component';
import { AddRelacionComponent } from './personas/utilsPersonas/relacionFamiliar/addRelacion/addRelacion.component';
import { SubscripcionesComponent } from './subscrpciones/subscrpciones.component';
import { AddSubscripcionesComponent } from './subscrpciones/addSubscripciones/addSubscripciones.component';
import { ExpedienteDigitalComponent } from './personas/utilsPersonas/expedienteDigital/expedienteDigital.component';
import { AddDocumentoComponent } from './personas/utilsPersonas/expedienteDigital/addDocumento/addDocumento.component';

@NgModule({
    declarations: [
        DashboardComponent,
        AccionistaComponent,
        SeriesComponent,
        PersonasComponent,
        ContactosComponent,
        DomiciliosComponent,
        RelacionFamiliarComponent,
        AddRelacionComponent,
        SubscripcionesComponent,
        AddSubscripcionesComponent,
        ExpedienteDigitalComponent,
        AddDocumentoComponent
    ],
    imports: [
        CommonModule,
        BeneficiarioRoutingModule,
        SharedModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' } // SE AGREGA PARA LA FECHA DE LSO DATE PIKCER
    ]
})
export class BeneficiarioModule { }