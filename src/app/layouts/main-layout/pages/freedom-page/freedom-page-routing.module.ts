import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreedomPageComponent } from './freedom-page.component';

const routes: Routes = [
  {
    path: '',
    component: FreedomPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreedomPageRoutingModule { }
