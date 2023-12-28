import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCommunityModalComponent } from './add-community-modal/add-community-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss'],
})
export class CommunitiesComponent {
  activeIdTab: string = 'local';
  communities: any = [];
  isCommunityLoader: boolean = false;
  profileId: number = null;

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private seoService: SeoService,
    private router: Router
  ) {
    this.profileId = Number(localStorage.getItem('profileId'));
    console.log(history.state.data)
    if (history.state.data) {
      const data = history.state.data
      this.getAllCommunities(data);
    } else {

      this.getAllCommunities({});
    }
    // this.getCommunities();
    const data = {
      title: 'HealingTube Health Practitioner',
      url: `${window.location.href}`,
      description: '',
    };
    this.seoService.updateSeoMetaData(data);
  }

  getCommunities(): void {
    let getCommunitiesObs = null;
    this.communities = [];

    if (this.activeIdTab === 'joined') {
      getCommunitiesObs = this.communityService.getJoinedCommunityByProfileId(this.profileId, 'community');
    } else if (this.activeIdTab === 'local') {
      getCommunitiesObs = this.communityService.getCommunity(this.profileId, 'community');
    } else {
      getCommunitiesObs = this.communityService.getCommunityByUserId(this.profileId, 'community');
    }
    this.isCommunityLoader = true;
    getCommunitiesObs?.subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.communities = res?.data;
        } else {
          this.communities = [];
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isCommunityLoader = false;
      }
    });
  }

  getAllCommunities(data: any): void {
    this.communities = [];
    this.isCommunityLoader = true;
    this.communityService.getAllCommunities(data).subscribe({
      next: (res: any) => {
        if (res) {
          this.communities = res;
        } else {
          this.communities = [];
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isCommunityLoader = false;
      }
    });
  }


  createCommunity() {
    this.router.navigate(['health-practitioner/add-practitioner'])
  }
  // createCommunity() {
  //   const modalRef = this.modalService.open(AddCommunityModalComponent, {
  //     centered: true,
  //     backdrop: 'static',
  //     keyboard: false,
  //     size: 'lg'
  //   });
  //   modalRef.componentInstance.cancelButtonLabel = 'Cancel';
  //   modalRef.componentInstance.confirmButtonLabel = 'Create';
  //   modalRef.componentInstance.closeIcon = true;
  //   modalRef.result.then(res => {
  //     if (res === 'success') {
  //       this.activeIdTab = 'my';
  //       this.getCommunities();
  //     }
  //   });
  // }
}
