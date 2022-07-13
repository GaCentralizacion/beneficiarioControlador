import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiarioRoutingModule } from './beneficiario-routing.module';
import { SharedModule } from 'app/shared/shared.module';

/** IMPORT COMPONENTS */
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccionistaComponent } from './accionista/accionista.component';
import { SeriesComponent } from './series/series.component';

@NgModule({
    declarations: [
        DashboardComponent,
        AccionistaComponent,
        SeriesComponent
    ],
    imports: [
        CommonModule,
        BeneficiarioRoutingModule,
        SharedModule
    ]
})
export class BeneficiarioModule { }