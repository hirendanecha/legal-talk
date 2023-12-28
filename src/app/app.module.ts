import { NgModule } from '@angular/core';
import {
  BrowserModule,
  Meta,
  provideClientHydration,
} from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastsContainerComponent } from './@shared/components/toasts-container/toasts-container.component';
import { LandingPageComponent } from './layouts/auth-layout/pages/landing-page/landing-page.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationGuard } from './@shared/guards/authentication.guard';
import { SharedModule } from './@shared/shared.module';

@NgModule({
  declarations: [AppComponent, ToastsContainerComponent, LandingPageComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BrowserModule.withServerTransition({ appId: 'HealingTube' }),
    BrowserAnimationsModule,
    TransferHttpCacheModule,
  ],
  providers: [
    AuthenticationGuard,
    CookieService,
    Meta,
    provideClientHydration(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
