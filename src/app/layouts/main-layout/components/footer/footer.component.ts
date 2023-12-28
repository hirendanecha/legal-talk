import { Component } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../../../@shared/services/shared.service';
import { ProfileMenusModalComponent } from '../profile-menus-modal/profile-menus-modal.component';
import { NotificationsModalComponent } from '../notifications-modal/notifications-modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

  constructor(
    public sharedService: SharedService,
    private offcanvasService: NgbOffcanvas,
  ) {
  }

  openProfileMenuModal(): void {
    this.offcanvasService.open(ProfileMenusModalComponent, { position: 'end', panelClass: 'w-300-px' });
  }

  openNotificationsModal(): void {
    this.offcanvasService.open(NotificationsModalComponent, { position: 'start', panelClass: 'w-300-px' });
  }
}
