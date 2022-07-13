import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiarioRoutingModule } from './beneficiario-routing.module';
import { SharedModule } from 'app/shared/shared.module';

/** IMPORT COMPONENTS */
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccionistaComponent } from './accionista/accionista.component';
import { SeriesComponent } from './series/series.component';
import { PersonasComponent } from './personas/personas.component';

@NgModule({
    declarations: [
        DashboardComponent,
        AccionistaComponent,
        SeriesComponent,
        PersonasComponent
    ],
    imports: [
        CommonModule,
        BeneficiarioRoutingModule,
        SharedModule
    ]
})
export class BeneficiarioModule { }