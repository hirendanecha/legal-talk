import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealingPractitionerRegistrationComponent } from './healing-practitioner-registration.component';

const routes: Routes = [
  {
    path: '',
    component: HealingPractitionerRegistrationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthPractitionerRegistrationRoutingModule { }
