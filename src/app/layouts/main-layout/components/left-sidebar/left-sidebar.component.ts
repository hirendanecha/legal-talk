import { Component, OnInit } from '@angular/core';
import { WalletLinkComponent } from '../../../../@shared/modals/wallet-download-modal/1776-wallet.component';
import {
  NgbActiveOffcanvas,
  NgbModal,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { ClaimTokenModalComponent } from 'src/app/@shared/modals/clai-1776-token-modal/claim-token-modal.component';
import { BreakpointService } from 'src/app/@shared/services/breakpoint.service';
import { ResearchSidebarComponent } from '../research-sidebar/research-sidebar.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { ProfileMenusModalComponent } from '../profile-menus-modal/profile-menus-modal.component';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { Router } from '@angular/router';
import { ConferenceLinkComponent } from 'src/app/@shared/modals/create-conference-link/conference-link-modal.component';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent implements OnInit {
  isSettingMenuCollapse = true;
  user: any = {};
  isRead: any
  sidebar: any = {
    isShowLeftSideBar: true,
    isShowRightSideBar: true,
    isShowResearchLeftSideBar: false,
  };
  profileId: number
  originalFavicon: HTMLLinkElement;
  constructor(
    private modalService: NgbModal,
    public sharedService: SharedService,
    private customerService: CustomerService,
    private activeOffcanvas: NgbActiveOffcanvas,
    public breakpointService: BreakpointService,
    private offcanvasService: NgbOffcanvas,
    public tokenService: TokenStorageService,
    private router: Router
  ) {
    this.profileId = +localStorage.getItem('profileId');
    this.isRead = localStorage.getItem('isRead');
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.originalFavicon = document.querySelector('link[rel="icon"]');
  }

  openWalletPopUp() {
    this.closeSidebar();

    const modalRef = this.modalService.open(WalletLinkComponent, {
      centered: true,
      keyboard: true,
      size: 'md',
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
    modalRef.componentInstance.closeIcon = true;
  }

  openClaimTokenPopUp() {
    this.closeSidebar();

    const modalRef = this.modalService.open(ClaimTokenModalComponent, {
      centered: true,
      keyboard: true,
      size: 'lg',
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
    modalRef.componentInstance.closeIcon = true;
  }

  getUserDetails(): void {
    const id = window.sessionStorage.user_id;
    if (id) {
      this.customerService.getCustomer(id).subscribe({
        next: (data: any) => {
          if (data) {
            this.user = data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  notificationNavigation() {
    this.closeSidebar();
    this.originalFavicon.href = '/assets/images/default-profile.jpg';
    if (this.isRead === 'N') {
      localStorage.setItem('isRead', 'Y');
      this.sharedService.isNotify = false;
    }
  }

  reloadPage(): void {
    this.closeSidebar();
    window.scrollTo(0, 0);
    this.router.navigate(['home']);
    // .then(() => {
    //   location.reload();
    // })
  }

  closeSidebar(): void {
    this.activeOffcanvas.dismiss('close');
  }

  openRightSidebar() {
    this.offcanvasService.open(RightSidebarComponent, {
      position: 'end',
      panelClass: 'w-300-px',
    });
    this.closeSidebar();
  }

  openProfileMenuModal(): void {
    this.offcanvasService.open(ProfileMenusModalComponent, {
      position: 'end',
      panelClass: 'w-300-px',
    });
    this.closeSidebar();
  }
  uniqueLink(){
    const modalRef = this.modalService.open(ConferenceLinkComponent, {
      centered: true,
    });
  }
}
