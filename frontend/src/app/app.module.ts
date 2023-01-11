import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { CommonModule } from '@angular/common';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EmailValidator, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { appRoutes } from 'app/app.routing';

// BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//SERVICIOS
import { GaService } from './services/ga.service';

import { NgxSpinnerModule } from "ngx-spinner";
import { CurrencyMaskModule } from "ng2-currency-mask";

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        CommonModule,
        HttpClientModule,

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // BOOTSTRAP
        NgbModule,
        FormsModule,
        MatFormFieldModule,
        MatDialogModule,
        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        NgxSpinnerModule,
        CurrencyMaskModule
    ],
    providers: [
        GaService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
