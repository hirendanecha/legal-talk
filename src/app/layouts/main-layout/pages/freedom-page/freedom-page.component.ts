import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFreedomPageComponent } from './add-page-modal/add-page-modal.component';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { SeoService } from 'src/app/@shared/services/seo.service';

@Component({
  selector: 'app-freedom-page',
  templateUrl: './freedom-page.component.html',
  styleUrls: ['./freedom-page.component.scss'],
})
export class FreedomPageComponent {
  activeIdTab: string = 'local';
  pageList = []
  profileId: number
  isPageLoader: boolean = false;


  constructor(
    private modalService: NgbModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private seoService: SeoService
  ) {
    this.profileId = Number(localStorage.getItem('profileId'));

    this.getPages();
    const data = {
      title: 'HealingTube Health Topics',
      url: `${location.href}`,
      description: '',
    };
    this.seoService.updateSeoMetaData(data);
  }

  createCommunity() {
    const modalRef = this.modalService.open(AddFreedomPageComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Create';
    modalRef.componentInstance.closeIcon = true;
    modalRef.result.then(res => {
      if (res === 'success') {
        this.activeIdTab = 'my';
        this.getPages();
      }
    });
  }

  getPages(): void {
    let getPagesObs = null;
    this.pageList = [];

    if (this.activeIdTab === 'joined') {
      getPagesObs = this.communityService.getJoinedCommunityByProfileId(this.profileId, 'page');
    } else if (this.activeIdTab === 'local') {
      getPagesObs = this.communityService.getCommunity(this.profileId, 'page');
    } else {
      getPagesObs = this.communityService.getCommunityByUserId(this.profileId, 'page');
    }

    this.isPageLoader = true;
    getPagesObs?.subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.pageList = res?.data;
        } else {
          this.pageList = [];
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isPageLoader = false;
      }
    });
  }

  goToFindCommunity() {
    this.router.navigate(['/communities-post']);
  }
}
