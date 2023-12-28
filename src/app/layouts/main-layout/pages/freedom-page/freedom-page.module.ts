import { NgModule } from '@angular/core';

import { FreedomPageRoutingModule } from './freedom-page-routing.module';
import { AddFreedomPageComponent } from './add-page-modal/add-page-modal.component';
import { FreedomPageComponent } from './freedom-page.component';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  declarations: [
    FreedomPageComponent,
    AddFreedomPageComponent,
  ],
  imports: [FreedomPageRoutingModule, SharedModule],
  exports: [
  ],
})
export class FreedomPageModule { }
