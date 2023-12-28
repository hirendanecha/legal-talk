import { NgModule } from '@angular/core';

import { AddCommunityModalComponent } from './add-community-modal/add-community-modal.component';
import { CommunitiesRoutingModule } from './communities-routing.module';
import { CommunitiesComponent } from './communities.component';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  declarations: [
    CommunitiesComponent,
    AddCommunityModalComponent,
  ],
  imports: [CommunitiesRoutingModule, SharedModule],
})
export class CommunitiesModule {}
