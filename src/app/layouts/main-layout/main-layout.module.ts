import { NgModule } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';
import {
  NgbActiveModal, NgbActiveOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import {
  LAZYLOAD_IMAGE_HOOKS,
  LazyLoadImageModule,
  ScrollHooks,
} from 'ng-lazyload-image';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { SharedModule } from 'src/app/@shared/shared.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { ResearchSidebarComponent } from './components/research-sidebar/research-sidebar.component';
import { ProfileMenusModalComponent } from './components/profile-menus-modal/profile-menus-modal.component';
import { NotificationsModalComponent } from './components/notifications-modal/notifications-modal.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent,
    LeftSidebarComponent,
    ResearchSidebarComponent,
    ProfileMenusModalComponent,
    NotificationsModalComponent,
  ],
  imports: [
    MainLayoutRoutingModule,
    SharedModule,
    LazyLoadImageModule,
  ],
})
export class MainLayoutModule {}
