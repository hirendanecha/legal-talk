import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { ForgotPasswordComponent } from 'src/app/layouts/auth-layout/pages/forgot-password/forgot-password.component';

@Component({
  selector: 'app-profile-menus-modal',
  templateUrl: './profile-menus-modal.component.html',
  styleUrls: ['./profile-menus-modal.component.scss']
})
export class ProfileMenusModalComponent {
  profileId: number;
  userId: number

  constructor(
    public sharedService: SharedService,
    private activeModal: NgbActiveModal,
    private activeOffcanvas: NgbActiveOffcanvas,
    private modalService: NgbModal,
    private toastService: ToastService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private customerService: CustomerService,
    private cookieService: CookieService,
  ) {
    this.userId = +(this.tokenStorageService.getUser().Id) as any;
    this.profileId = +localStorage.getItem('profileId');
  }

  closeMenu(e: MouseEvent, type: string) {
    if (e && type) {
      e.preventDefault();

      switch (type) {
        case 'profile':
          this.goToViewProfile();
          break;
        case 'logout':
          this.logout();
          break;
        case 'setting':
          this.goToSetting();
          break;
        case 'change-password':
          this.forgotPasswordOpen();
          break;
        default:
          break;
      }
    }

    this.activeModal?.dismiss();
    this.activeOffcanvas?.dismiss();
  }

  logout(): void {
    // this.isCollapsed = true;
    this.customerService.logout().subscribe({
      next: (res => {
        this.tokenStorageService.signOut();
        console.log(res)
      })
    })
    // this.toastService.success('Logout successfully');
    // this.router.navigate(['/auth']);
    // this.isDomain = false;
  }

  goToSetting() {
    this.router.navigate([`settings/edit-profile/${this.userId}`]);
    // window.open(`settings/edit-profile/${userId}`, '_blank')
  }

  goToViewProfile() {
    // window.open(`settings/view-profile/${profileId}`, '_blank')
    this.router.navigate([`settings/view-profile/${this.profileId}`]);
  }

  forgotPasswordOpen() {
    const modalRef = this.modalService.open(ForgotPasswordComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Submit';
    modalRef.componentInstance.closeIcon = true;
    // modelRef.result.then(res => {
    //   return res = user_id
    // });
  }
}
