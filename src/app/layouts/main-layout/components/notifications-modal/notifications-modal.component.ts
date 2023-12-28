import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { SocketService } from 'src/app/@shared/services/socket.service';

@Component({
  selector: 'app-notifications-modal',
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.scss'],  
})
export class NotificationsModalComponent implements AfterViewInit {
  originalFavicon: HTMLLinkElement;
  constructor(
    public sharedService: SharedService,
    private activeModal: NgbActiveModal,
    private activeOffcanvas: NgbActiveOffcanvas,
    private customerService: CustomerService,
    private router: Router,
    private socketService: SocketService
  ) {
    this.sharedService.getNotificationList();
    this.originalFavicon = document.querySelector('link[rel="icon"]');
  }

  ngAfterViewInit(): void {
    const profileId = +localStorage.getItem('profileId');
    this.socketService.readNotification({ profileId }, (data) => {
    });
  }

  readUnreadNotification(postId: string, notificationId: number): void {
    this.customerService.readUnreadNotification(notificationId, 'Y').subscribe({
      next: (res) => {
        this.router.navigate([`post/${postId}`]);
        // window.open(`post/${postId}`.toString(), '_blank')
        this.closeModal();
      },
    });
  }

  closeModal(): void {
    this.activeModal?.dismiss();
    this.activeOffcanvas?.dismiss();
  }
}
