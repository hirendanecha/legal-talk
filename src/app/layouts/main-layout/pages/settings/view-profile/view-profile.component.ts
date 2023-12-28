import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Customer } from 'src/app/@shared/constant/customer';
import { BreakpointService } from 'src/app/@shared/services/breakpoint.service';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { PostService } from 'src/app/@shared/services/post.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  customer: any = {};
  // customer: Customer = new Customer();
  customerPostList: any = [];
  userId = '';
  profilePic: any = {};
  coverPic: any = {};
  profileId: number;
  activeTab = 1;
  communityList = [];
  communityId = '';
  isExpand = false;
  pdfList: any = [];
  constructor(
    private modalService: NgbActiveModal,
    private router: Router,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private tokenStorage: TokenStorageService,
    public sharedService: SharedService,
    private communityService: CommunityService,
    public breakpointService: BreakpointService,
    private postService: PostService,
    private seoService: SeoService,
  ) {
    this.router.events.subscribe((event: any) => {
      const id = event?.routerEvent?.url.split('/')[3];
      this.profileId = id
      if (id) {
        this.getProfile(id);
      }
      this.profileId = +localStorage.getItem('profileId');
    });
  }
  ngOnInit(): void {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate([`/login`]);
    }
    this.modalService.close();
  }

  ngAfterViewInit(): void { }

  getProfile(id): void {
    this.spinner.show();
    this.customerService.getProfile(id).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.data) {
          this.customer = res.data[0];
          this.userId = res.data[0]?.UserID;
          const data = {
            title: this.customer?.FirstName + ' ' + this.customer?.LastName,
            url: `${environment.webUrl}settings/view-profile/${this.customer?.Id}`,
            description: '',
            image: this.customer?.ProfilePicName,
          };
          this.seoService.updateSeoMetaData(data);
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  getCommunities(): void {
    this.spinner.show();
    this.communityList = [];
    this.communityService
      .getCommunityByUserId(this.profileId, 'community')
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            // this.communityList = res.data;
            res.data.forEach((element) => {
              if (element.Id && element.isApprove === 'Y') {
                this.communityList.push(element);
              }
            });
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        },
      });
  }

  goToCommunityDetails(community: any): void {
    this.router.navigate(['health-practitioner']);
  }

  openDropDown(id) {
    this.communityId = id;
    if (this.communityId) {
      this.isExpand = true;
    } else {
      this.isExpand = false;
    }
  }
  openEditProfile(): void {
    this.router.navigate([`settings/edit-profile/${this.profileId}`]);
  }

  ngOnDestroy(): void {
    this.communityList = [];
  }

  getPdfs(): void {
    this.postService.getPdfsFile(this.customer.Id).subscribe(
      {
        next: (res: any) => {
          this.spinner.hide();
          if (res) {
            res.map((e: any) => {
              e.pdfName = e.pdfUrl.split('/')[3].replaceAll('%', ' ')
            })
            this.pdfList = res;
            console.log(this.pdfList);
          }
        },
        error:
          (error) => {
            this.spinner.hide();
            console.log(error);
          }
      });
  }

  viewUserPost(id) {
    // this.router.navigate([`post/${id}`]);
    window.open(`post/${id}`, '_blank');
  }

  downloadPdf(pdf): void {
    const pdfLink = document.createElement('a');
    pdfLink.href = pdf;
    // window.open(pdf);
    // pdfLink.download = "TestFile.pdf";
    pdfLink.click();
  }
}
