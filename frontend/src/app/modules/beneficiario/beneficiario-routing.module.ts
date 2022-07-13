import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//COMPONENTES
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccionistaComponent } from './accionista/accionista.component';
import { SeriesComponent } from './series/series.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'accionista',
        component: AccionistaComponent,
    },
    {
        path: 'series',
        component: SeriesComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BeneficiarioRoutingModule { }
