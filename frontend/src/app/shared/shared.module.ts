import {
    DevExtremeModule,
    DxDataGridModule,
    DxFileUploaderModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxDropDownBoxModule,
    DxAutocompleteModule,
    DxTemplateModule
} from 'devextreme-angular';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponentComponent } from 'app/utilerias/grid-component/grid-component.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTabsModule } from '@angular/material/tabs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from 'app/material.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
    declarations: [
        GridComponentComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // DEVEXTREME
        DevExtremeModule,
        DxDataGridModule,
        DxFileUploaderModule,
        DxCheckBoxModule,
        DxSelectBoxModule,
        DxButtonModule,
        DxDropDownBoxModule,
        DxAutocompleteModule,
        DxTemplateModule,
        // Angular Materal
        MaterialModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // DEVEXTREME
        DevExtremeModule,
        DxDataGridModule,
        DxFileUploaderModule,
        DxCheckBoxModule,
        DxSelectBoxModule,
        DxButtonModule,
        DxDropDownBoxModule,
        DxAutocompleteModule,
        DxTemplateModule,
        // Angular Materal
        MaterialModule,
        MatButtonModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        TranslocoModule,
        NgxSpinnerModule,
        CurrencyMaskModule,
        //UTILERIAS
        GridComponentComponent
    ]
})
export class SharedModule {
}
