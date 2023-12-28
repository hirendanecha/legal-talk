import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResearchListComponent } from './research-list/research-list.component';
import { ResearchDetailsComponent } from './research-details/research-details.component';
import { ResearchPostComponent } from './research-post/research-post.component';

const routes: Routes = [
  {
    path: '',
    component: ResearchListComponent,
  },
  {
    path: ':uniqueLink',
    component: ResearchDetailsComponent,
  },
  {
    path: 'post/:id',
    component: ResearchPostComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResearchRoutingModule { }
