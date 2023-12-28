import { NgModule } from '@angular/core';

import { ResearchRoutingModule } from './research-routing.module';
import { NgbCarouselModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ResearchListComponent } from './research-list/research-list.component';
import { ResearchDetailsComponent } from './research-details/research-details.component';
import { ResearchPostComponent } from './research-post/research-post.component';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ResearchCardComponent } from 'src/app/@shared/components/research-card/research-card.component';


@NgModule({
  declarations: [
    ResearchListComponent,
    ResearchDetailsComponent,
    ResearchCardComponent,
    ResearchPostComponent
  ],
  imports: [
    SharedModule,
    NgbCollapseModule,
    ResearchRoutingModule,
    NgbCarouselModule
  ],
})
export class ResearchModule { }
