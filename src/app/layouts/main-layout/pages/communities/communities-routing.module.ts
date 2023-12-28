import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunitiesComponent } from './communities.component';
import { AddCommunityModalComponent } from './add-community-modal/add-community-modal.component';

const routes: Routes = [
  {
    path: '',
    component: CommunitiesComponent,
  },
  {
    path: 'add-practitioner',
    component: AddCommunityModalComponent,
    data: {
      isShowRightSideBar: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunitiesRoutingModule {}
