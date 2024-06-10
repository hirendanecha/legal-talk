import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/@shared/modals/confirmation-modal/confirmation-modal.component';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { PostService } from 'src/app/@shared/services/post.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { getTagUsersFromAnchorTags } from 'src/app/@shared/utils/utils';
import { VideoPostModalComponent } from 'src/app/@shared/modals/video-post-modal/video-post-modal.component';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { AddCommunityModalComponent } from '../communities/add-community-modal/add-community-modal.component';
import { AddFreedomPageComponent } from '../freedom-page/add-page-modal/add-page-modal.component';
// import { MetafrenzyService } from 'ngx-metafrenzy';
import { isPlatformBrowser } from '@angular/common';
import { Howl } from 'howler';
import { EditPostModalComponent } from 'src/app/@shared/modals/edit-post-modal/edit-post-modal.component';
import * as moment from 'moment';
import { AppointmentsService } from 'src/app/@shared/services/appointment.service';
import { AppointmentModalComponent } from 'src/app/@shared/modals/appointment-modal/appointment-modal.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // providers: [MetafrenzyService]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  postMessageInputValue: string = '';
  postMessageTags: any[];
  postData: any = {
    profileid: '',
    communityId: '',
    postdescription: '',
    meta: {},
    tags: [],
    file: {},
    imageUrl: '',
    posttype: 'S',
    pdfUrl: '',
  };

  communitySlug: string;
  communityDetails: any;
  profileId = '';

  activeCommunityTab: number = 1;
  isNavigationEnd = false;
  searchText = '';
  @ViewChild('addMemberSearchDropdownRef', { static: false, read: NgbDropdown })
  addMemberSearchNgbDropdown: NgbDropdown;
  userList: any = [];
  memberIds: any = [];
  pdfName: string = '';
  notificationId: number;
  buttonClicked = false;
  originalFavicon: HTMLLinkElement;
  notificationSoundOct = '';

  appointmentList = [];

  invoiceList: any[] = [
    {
      "id": 41,
      "appointmentDateTime": "2024-01-31T03:01:00.000Z",
      "profileId": 68001,
      "practitionerProfileId": 68001,
      "amt": 30,
      "createdDate": "2024-01-16T09:21:45.000Z",
      "isCancelled": "N",
      "practitionerName": "Opash DR",
      "Username": "veee",
      "FirstName": "Ajay",
      "LastName": "Gadhwal",
      "ProfilePicName": "https://healing-tube.s3.us-west-1.wasabisys.com/dummy-image-300x298.jpg"
    },
    {
      "id": 42,
      "appointmentDateTime": "2024-02-01T08:30:00.000Z",
      "profileId": 78002,
      "practitionerProfileId": 78002,
      "amt": 200,
      "createdDate": "2024-02-15T14:10:22.000Z",
      "isCancelled": "N",
      "practitionerName": "Jane Smith",
      "Username": "jane_smith",
      "FirstName": "Jane",
      "LastName": "Smith",
      "ProfilePicName": "https://healing-tube.s3.us-west-1.wasabisys.com/dummy-image-300x298.jpg"
    },
    {
      "id": 43,
      "appointmentDateTime": "2024-02-28T12:00:00.000Z",
      "profileId": 78003,
      "practitionerProfileId": 78003,
      "amt": 120,
      "createdDate": "2024-02-20T09:45:11.000Z",
      "isCancelled": "Y",
      "practitionerName": "John Doe",
      "Username": "john_doe",
      "FirstName": "John",
      "LastName": "Doe",
      "ProfilePicName": "https://healing-tube.s3.us-west-1.wasabisys.com/dummy-image-300x298.jpg"
    },
    {
      "id": 44,
      "appointmentDateTime": "2024-03-10T15:45:00.000Z",
      "profileId": 78004,
      "practitionerProfileId": 78004,
      "amt": 220,
      "createdDate": "2024-03-05T11:30:18.000Z",
      "isCancelled": "N",
      "practitionerName": "Anna Johnson",
      "Username": "anna_johnson",
      "FirstName": "Anna",
      "LastName": "Johnson",
      "ProfilePicName": "https://healing-tube.s3.us-west-1.wasabisys.com/dummy-image-300x298.jpg"
    },
    {
      "id": 45,
      "appointmentDateTime": "2024-03-20T09:00:00.000Z",
      "profileId": 78005,
      "practitionerProfileId": 78005,
      "amt": 300,
      "createdDate": "2024-03-15T13:20:05.000Z",
      "isCancelled": "Y",
      "practitionerName": "Michael Brown",
      "Username": "michael_brown",
      "FirstName": "Michael",
      "LastName": "Brown",
      "ProfilePicName": "https://healing-tube.s3.us-west-1.wasabisys.com/dummy-image-300x298.jpg"
    }
  ];

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    public sharedService: SharedService,
    private socketService: SocketService,
    private toastService: ToastService,
    private communityService: CommunityService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    public tokenService: TokenStorageService,
    private seoService: SeoService,
    private appointmentService: AppointmentsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.profileId = localStorage.getItem('profileId');
      this.postData.profileid = +this.profileId;

      this.route.paramMap.subscribe((paramMap) => {
        const name = paramMap.get('name');

        if (name) {
          this.communitySlug = name;
          this.getCommunityDetailsBySlug();
        } else {
          this.sharedService.advertizementLink = [];
        }

        this.isNavigationEnd = true;
      });
      const data = {
        title: 'Legaltalk Tube',
        url: `${window.location.href}`,
      };
      this.seoService.updateSeoMetaData(data);
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.socketService.socket?.connected) {
      this.socketService.socket?.connect();
    }
    this.socketService.socket?.on(
      'new-post-added',
      (res: any) => {
        this.spinner.hide();
        this.resetPost();
      },
      (error: any) => {
        this.spinner.hide();
        console.log(error);
      }
    );
    if (!this.socketService.socket?.connected) {
      this.socketService.socket?.connect();
    }

    this.socketService.socket?.emit('join', { room: this.profileId });
    this.socketService.socket?.on('notification', (data: any) => {
      if (data) {
        this.notificationId = data.id;
        this.sharedService.isNotify = true;
        this.originalFavicon.href = '/assets/images/icon-unread.jpg';
        if (data?.actionType === 'T') {
          var sound = new Howl({
            src: ['https://s3.us-east-1.wasabisys.com/freedom-social/freedom-notification.mp3']
          });
          this.notificationSoundOct = localStorage?.getItem('notificationSoundEnabled');
          if (this.notificationSoundOct !== 'N') {
            if (sound) {
              sound?.play();
            }
          }
        }
        if (this.notificationId) {
          this.customerService.getNotification(this.notificationId).subscribe({
            next: (res) => {
              localStorage.setItem('isRead', res.data[0]?.isRead);
            },
            error: (error) => {
              console.log(error);
            },
          });
        }
      }
    });
    const isRead = localStorage.getItem('isRead');
    if (isRead === 'N') {
      this.sharedService.isNotify = true;
    }
  }


  ngOnDestroy(): void { }

  onPostFileSelect(event: any): void {
    const file = event.target?.files?.[0] || {};
    // console.log(file)
    if (file.type.includes('application/pdf')) {
      this.postData['file'] = file;
      this.pdfName = file?.name;
      this.postData['imageUrl'] = null;
      this.postData['streamname'] = null;
    } else {
      this.postData['file'] = file;
      this.postData['imageUrl'] = URL.createObjectURL(file);
      this.pdfName = null;
      this.postData['pdfUrl'] = null;
    }
    // if (file?.size < 5120000) {
    // } else {
    //   this.toastService.warring('Image is too large!');
    // }
  }

  removePostSelectedFile(): void {
    this.postData['file'] = null;
    this.postData['imageUrl'] = null;
    this.pdfName = null;
  }

  getCommunityDetailsBySlug(): void {
    if (this.communitySlug) {
      this.spinner.show();
      this.communityService.getCommunityBySlug(this.communitySlug).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res?.Id) {
            const details = res;
            if (res.pageType === 'page') {
              this.sharedService.getAdvertizeMentLink(res?.Id);
            } else {
              this.sharedService.advertizementLink = null;
            }
            const data = {
              title: details?.CommunityName,
              url: `${environment.webUrl}${details?.pageType}/${details?.slug}`,
              description: details.CommunityDescription,
              image: details?.coverImg,
            };
            // this.metafrenzyService.setTitle(data.title);
            // this.metafrenzyService.setMetaTag('og:title', data.title);
            // this.metafrenzyService.setMetaTag('og:description', data.description);
            // this.metafrenzyService.setMetaTag('og:url', data.url);
            // this.metafrenzyService.setMetaTag('og:image', data.image);
            // this.metafrenzyService.setMetaTag("og:site_name", 'Freedom.Buzz');
            // this.metafrenzyService.setOpenGraph({
            //   title: data.title,
            //   //description: post.postToProfileIdName === '' ? post.profileName: post.postToProfileIdName,
            //   description: data.description,
            //   url: data.url,
            //   image: data.image,
            //   site_name: 'Freedom.Buzz'
            // });
            this.seoService.updateSeoMetaData(data);

            if (details?.memberList?.length > 0) {
              details['memberIds'] = details?.memberList?.map(
                (member: any) => member?.profileId
              );
              details['adminIds'] = details?.memberList?.map((member: any) =>
                member.isAdmin === 'Y' ? member?.profileId : null
              );
            }

            this.communityDetails = details;
            this.postData.communityId = this.communityDetails?.Id;
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        },
      });
    }
  }

  createCommunityAdmin(member: any): void {
    let data = {};
    if (member.isAdmin === 'Y') {
      data = {
        id: member?.Id,
        isAdmin: 'N',
      };
    } else {
      data = {
        id: member?.Id,
        isAdmin: 'Y',
      };
    }
    this.communityService.createCommunityAdmin(data).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastService.success(res.message);
          this.getCommunityDetailsBySlug();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  addEmoji(event: { emoji: { native: any } }) {
    // const { message } = this;
    // const text = `${message}${event.emoji.native}`;
    // this.message = text;
  }

  uploadPostFileAndCreatePost(): void {
    this.buttonClicked = true;
    if (this.postData?.postdescription || this.postData?.file?.name) {
      if (this.postData?.file?.name) {
        this.spinner.show();
        this.postService.uploadFile(this.postData?.file).subscribe({
          next: (res: any) => {
            // this.spinner.hide();
            if (res?.body?.url) {
              if (this.postData?.file.type.includes('application/pdf')) {
                this.postData['pdfUrl'] = res?.body?.url;
                console.log('pdfUrl', res?.body?.url);
                this.postData['imageUrl'] = null;
                this.createOrEditPost();
              } else {
                this.postData['file'] = null;
                this.postData['imageUrl'] = res?.body?.url;
                this.postData['pdfUrl'] = null;
                this.createOrEditPost();
              }
            }
            // if (this.postData.file?.size < 5120000) {
            // } else {
            //   this.toastService.warring('Image is too large!');
            // }
          },
          error: (err) => {
            this.spinner.hide();
          },
        });
      } else {
        this.spinner.hide();
        this.createOrEditPost();
      }
    }
  }

  createOrEditPost(): void {
    this.postData.tags = getTagUsersFromAnchorTags(this.postMessageTags);
    if (
      this.postData?.postdescription ||
      this.postData?.imageUrl ||
      this.postData?.pdfUrl
    ) {
      if (this.postData?.meta?.metalink || this.postData?.metalink) {
        this.postData.metalink = null
        this.postData.title = null
        this.postData.metaimage = null
        this.postData.metadescription = null
        console.log(this.postData);

      }
      // this.spinner.show();
      console.log(
        'postData',
        this.postData,
        this.socketService.socket?.connected
      );
      this.toastService.success('Post created successfully.');
      this.socketService?.createOrEditPost(this.postData);
      this.buttonClicked = false;
      this.resetPost();
      // , (data) => {
      //   this.spinner.hide();
      //   console.log(data)
      //   return data;
      // });
    }
  }

  onTagUserInputChangeEvent(data: any): void {
    // this.postMessageInputValue = data?.html
    // this.postData.postdescription = data?.html;
    this.extractImageUrlFromContent(data.html);
    this.postData.meta = data?.meta;
    this.postMessageTags = data?.tags;
  }

  resetPost() {
    this.postData['id'] = '';
    this.postData['postdescription'] = '';
    this.postData['meta'] = {};
    this.postData['tags'] = [];
    this.postData['file'] = {};
    this.postData['imageUrl'] = '';
    this.postData['pdfUrl'] = '';
    this.pdfName = '';
    this.postMessageInputValue = ' ';
    setTimeout(() => {
      this.postMessageInputValue = '';
    }, 100);
    this.postMessageTags = [];
  }

  onEditPost(post: any): void {
    // console.log('edit-post', post)
    if (post.posttype === 'V') {
      this.openUploadVideoModal(post);
    }
    //  else if (post.pdfUrl) {
    //   this.pdfName = post.pdfUrl.split('/')[3];
    //   console.log(this.pdfName);
    //   this.postData = { ...post };
    //   this.postMessageInputValue = this.postData?.postdescription;
    // }
    else {
      this.openUploadEditPostModal(post);
      // this.postData = { ...post };
      // this.postMessageInputValue = this.postData?.postdescription;
    }
    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth',
    // });
  }

  editCommunity(data): void {
    let modalRef: any
    if (data.pageType === 'community') {
      modalRef = this.modalService.open(AddCommunityModalComponent, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
      });
    } else {
      modalRef = this.modalService.open(AddFreedomPageComponent, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
      });
      data.link1 = this.sharedService?.advertizementLink[0]?.url;
      data.link2 = this.sharedService?.advertizementLink[1]?.url;
    }
    modalRef.componentInstance.title = `Edit ${
      data.pageType === 'community' ? 'lawyers' : 'Page'
    } Details`;
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Save';
    modalRef.componentInstance.closeIcon = true;
    modalRef.componentInstance.data = data;
    modalRef.result.then((res) => {
      if (res === 'success') {
        if (data.pageType === 'community') {
          this.router.navigate(['lawyers']);
        } else {
          this.router.navigate(['pages']);
        }
      }
    });
  }

  joinCommunity(id?): void {
    if (!this.buttonClicked) {
      const profileId = id || localStorage.getItem('profileId');
      const data = {
        profileId: profileId,
        communityId: this.communityDetails?.Id,
        IsActive: 'Y',
        isAdmin: 'N',
      };
      this.searchText = '';
      console.log(data);
      this.communityService.joinCommunity(data).subscribe(
        (res: any) => {
          if (res) {
            this.getCommunityDetailsBySlug();
          }
        },
        (error) => {
          console.log(error);
        }
      );
      this.buttonClicked = true;
    }
  }

  removeFromCommunity(id?): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = `Leave ${this.communityDetails.pageType === "community" ? "Lawyers" : "page"}`;
    modalRef.componentInstance.confirmButtonLabel = id ? 'Remove' : 'Leave';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    if (id) {
      modalRef.componentInstance.message = `Are you sure want to remove this member from ${this.communityDetails.pageType === "community" ? "Lawyers" : "page"}?`;
    } else {
      modalRef.componentInstance.message = `Are you sure want to Leave from this ${this.communityDetails.pageType === "community" ? "Lawyers" : "page"}?`;
    }
    modalRef.result.then((res) => {
      if (res === 'success') {
        const profileId = Number(localStorage.getItem('profileId'));
        this.communityService
          .removeFromCommunity(this.communityDetails?.Id, id || profileId)
          .subscribe({
            next: (res: any) => {
              if (res) {
                this.toastService.success(res.message);
                this.getCommunityDetailsBySlug();
                if (this.buttonClicked) {
                  this.buttonClicked = false;
                }
              }
            },
            error: (error) => {
              console.log(error);
              this.toastService.danger(error.message);
            },
          });
      }
    });
  }

  deleteCommunity(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = `Delete ${this.communityDetails.pageType === "community" ? "Lawyers" : "page"}`;
    modalRef.componentInstance.confirmButtonLabel = 'Delete';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message = `Are you sure want to delete this ${this.communityDetails.pageType === "community" ? "Lawyers" : "page"}?`;
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.communityService
          .deleteCommunity(this.communityDetails?.Id)
          .subscribe({
            next: (res: any) => {
              if (res) {
                this.toastService.success(res.message);
                // this.getCommunityDetailsBySlug();
                this.router.navigate([
                  `${
                    this.communityDetails.pageType === 'community'
                      ? 'health-practitioner'
                      : 'pages'
                  }`,
                ]);
              }
            },
            error: (error) => {
              console.log(error);
              this.toastService.success(error.message);
            },
          });
      }
    });
  }

  getUserList(): void {
    this.customerService.getProfileList(this.searchText).subscribe({
      next: (res: any) => {
        if (res?.data?.length > 0) {
          this.userList = res.data;
          this.addMemberSearchNgbDropdown?.open();
        } else {
          this.userList = [];
          this.addMemberSearchNgbDropdown?.close();
        }
      },
      error: () => {
        this.userList = [];
        this.addMemberSearchNgbDropdown?.close();
      },
    });
  }

  openUploadVideoModal(post: any = {}): void {
    const modalRef = this.modalService.open(VideoPostModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.title = post.id ? `Edit Video` : `Upload Video`;
    modalRef.componentInstance.confirmButtonLabel = post.id
      ? `Save`
      : 'Create Post';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.communityId = this.communityDetails?.Id;
    modalRef.componentInstance.post = post.id ? post : null;
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.socketService.socket?.on('new-post');
      }
    });
  }
  openUploadEditPostModal(post: any = {}): void {
    const modalRef = this.modalService.open(EditPostModalComponent, {
      centered: true, backdrop: 'static',
    });
    modalRef.componentInstance.title = `Edit Post`;
    modalRef.componentInstance.confirmButtonLabel = `Save`
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.communityId = this.communityDetails?.Id;
    modalRef.componentInstance.data = post.id ? post : null;
    modalRef.result.then((res) => {
      if (res.id) {
        this.postData = res
        console.log(this.postData)
        this.uploadPostFileAndCreatePost();
      }
    });
  }

  openAlertMessage(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = `Warning message`;
    modalRef.componentInstance.confirmButtonLabel = 'Ok';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message = `Videos on Legaltalk Tube home are limited to 2 Minutes!
    Videos must be a mp4 format`;
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.openUploadVideoModal();
      }
    });
  }

  extractImageUrlFromContent(content: string): void {
    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = content;
    const imgTag = contentContainer.querySelector('img');

    if (imgTag) {
      const imgTitle = imgTag.getAttribute('title');
      const imgStyle = imgTag.getAttribute('style');
      const imageGif = imgTag
        .getAttribute('src')
        .toLowerCase()
        .endsWith('.gif');
      if (!imgTitle && !imgStyle && !imageGif) {
        const copyImage = imgTag.getAttribute('src');
        const bytes = copyImage.length;
        const megabytes = bytes / (1024 * 1024);
        if (megabytes > 1) {
          let copyImageTag = '<img\\s*src\\s*=\\s*""\\s*alt\\s*="">'
          this.postData['postdescription'] = `<div>${content.replace(copyImage, '').replace(/\<br\>/ig, '').replace(new RegExp(copyImageTag, 'g'), '')}</div>`;
          // this.postData['postdescription'] = content.replace(copyImage, '');
          const base64Image = copyImage
            .trim()
            .replace(/^data:image\/\w+;base64,/, '');
          try {
            const binaryString = window.atob(base64Image);
            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              uint8Array[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([uint8Array], { type: 'image/jpeg' });
            const fileName = `copyImage-${new Date().getTime()}.jpg`;
            const file = new File([blob], fileName, { type: 'image/jpeg' });
            this.postData.file = file;
          } catch (error) {
            console.error('Base64 decoding error:', error);
          }
        } else {
          this.postData['postdescription'] = content;
        }
      } else {
        this.postData['postdescription'] = content;
      }
    } else {
      this.postData['postdescription'] = content;
    }
  }

  openAppointmentPopUp(): void {
    const modalRef = this.modalService.open(AppointmentModalComponent, {
      centered: true,
      size: 'lg',
    });
    console.log(this.communityDetails);
    
    const data = {
      profileId: +this.profileId,
      practitionerProfileId: this.communityDetails?.profileId,
      practitionerName: this.communityDetails.CommunityName,
      slug: this.communityDetails.slug,
      topics: this.communityDetails.emphasis,
    };
    modalRef.componentInstance.title = `Appointment Date & Time`;
    modalRef.componentInstance.confirmButtonLabel = 'Ok';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.data = data;
    modalRef.result.then((res) => {
      if (res === 'success') {
        // this.openUploadVideoModal();
      }
    });
  }

  getAppoinments(id): void {
    this.appointmentService.appointmentPractitioner(id).subscribe({
      next: (res) => {
        this.appointmentList = res.data;
      },
      error: (err) => {},
    });
  }

  getStatus(appointment: any): string {
    const currentDate = new Date();
    const appointmentDate = new Date(appointment.appointmentDateTime);
    if (currentDate > appointmentDate) {
      return 'Expired';
    } else {
      return appointment.isCancelled === 'N' ? 'Scheduled' : 'Cancelled';
    }
  }

  getInvoiceStatus(invoice: any): string {
    const currentDate = new Date();
    const appointmentDate = new Date(invoice.appointmentDateTime);
    if (currentDate > appointmentDate) {
      return 'Upcoming';
    } else {
      return invoice.isCancelled === 'N' ? 'Active' : 'Expired';
    }
  }

  appointmentCancelation(obj) {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = `Cancel appointment`;
    modalRef.componentInstance.confirmButtonLabel = 'Ok';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message = `Are you sure want to cancel this appointment?`;
    modalRef.result.then((res) => {
      if (res === 'success') {
        const data = {
          appointmentId: obj.id,
          practitionerProfileId: obj.practitionerProfileId,
          profileId: obj.profileId,
          practitionerName: obj.practitionerName,
        };
        this.getCancelAppoinments(data);
      }
    });
  }

  getCancelAppoinments(obj): void {
    this.appointmentService.changeAppointmentStatus(obj).subscribe({
      next: (res) => {
        // this.appointmentList = res.data;
        this.toastService.success(res.message);
        this.getAppoinments(this.communityDetails.profileId);
      },
      error: (err) => {},
    });
  }

  displayLocalTime(utcDateTime: string): string {
    const localTime = moment.utc(utcDateTime).local();
    return localTime.format('h:mm A');
  }
}
