import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { SeeFirstUserComponent } from './see-first-user/see-first-user.component';
import { UnsubscribedUsersComponent } from './unsubscribed-users/unsubscribed-users.component';

const routes: Routes = [
  {
    path: 'edit-profile/:id',
    component: EditProfileComponent,
    data: {
      isShowLeftSideBar: false,
      isShowRightSideBar: false
    }
  },
  {
    path: 'view-profile/:id',
    component: ViewProfileComponent,
  },
  {
    path: 'delete-profile',
    component: DeleteAccountComponent,
  },
  {
    path: 'see-first-users',
    component: SeeFirstUserComponent,
  },
  {
    path: 'unsubscribed-users',
    component: UnsubscribedUsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
