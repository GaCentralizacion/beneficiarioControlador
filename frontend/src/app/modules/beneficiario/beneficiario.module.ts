import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { ShowDocumentoComponent } from './personas/utilsPersonas/expedienteDigital/showDocumento/showDocumento.component';
import { ShowIndirectosComponent } from './subscrpciones/showIndirectos/showIndirectos.component';
import { DecimalMask } from 'app/utilerias/pipes/decimal-mask.directive';
import { PagosSuscripcionesComponent } from './subscrpciones/pagosSuscripciones/pagosSuscripciones.component';
import { PagarSuscripcionComponent } from './subscrpciones/pagosSuscripciones/pagarSuscripcion/pagarSuscripcion.component';
import { VerPagosComponent } from './subscrpciones/pagosSuscripciones/verPagos/verPagos.component';

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
        AddDocumentoComponent,
        ShowDocumentoComponent,
        ShowIndirectosComponent,
        DecimalMask,
        PagosSuscripcionesComponent,
        PagarSuscripcionComponent,
        VerPagosComponent
    ],
    imports: [
        CommonModule,
        BeneficiarioRoutingModule,
        SharedModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        CurrencyPipe // SE AGREGA PARA LA FECHA DE LSO DATE PIKCER
    ]
})
export class BeneficiarioModule { }