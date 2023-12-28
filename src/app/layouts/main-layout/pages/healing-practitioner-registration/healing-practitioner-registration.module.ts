import { NgModule } from '@angular/core';
import { HealthPractitionerRegistrationRoutingModule } from './healing-practitioner-registration-routing.module';
import { SharedModule } from 'src/app/@shared/shared.module';
import { HealingPractitionerRegistrationComponent } from './healing-practitioner-registration.component';



@NgModule({
  declarations: [
    HealingPractitionerRegistrationComponent
  ],
  imports: [
    HealthPractitionerRegistrationRoutingModule, SharedModule
  ]
})
export class HealingPractitionerRegistrationModule { }
