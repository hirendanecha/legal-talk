import { NgModule } from '@angular/core';

import { SettingsRoutingModule } from './settings-routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { SeeFirstUserComponent } from './see-first-user/see-first-user.component';
import { UnsubscribedUsersComponent } from './unsubscribed-users/unsubscribed-users.component';
import { SharedModule } from 'src/app/@shared/shared.module';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

@NgModule({
  declarations: [
    EditProfileComponent,
    ViewProfileComponent,
    DeleteAccountComponent,
    SeeFirstUserComponent,
    UnsubscribedUsersComponent
  ],
  imports: [SettingsRoutingModule, SharedModule],
})
export class SettingsModule {}
