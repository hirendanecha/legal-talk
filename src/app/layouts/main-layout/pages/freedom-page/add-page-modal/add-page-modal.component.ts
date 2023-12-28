import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, forkJoin, fromEvent } from 'rxjs';
import { Community } from 'src/app/@shared/constant/customer';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { UploadFilesService } from 'src/app/@shared/services/upload-files.service';
import { slugify } from 'src/app/@shared/utils/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-page-modal',
  templateUrl: './add-page-modal.component.html',
  styleUrls: ['./add-page-modal.component.scss'],
})
export class AddFreedomPageComponent implements OnInit, AfterViewInit {
  @Input() title: string | undefined = 'Create Health Topics';
  @Input() cancelButtonLabel: string | undefined = 'Cancel';
  @Input() confirmButtonLabel: string | undefined = 'Create';
  @Input() closeIcon: boolean | undefined;
  @Input() data: any = [];

  pageDetails = new Community();
  submitted = false;
  registrationMessage = '';
  selectedFile: File;
  logoImg: any;
  coverImg: any;
  userId = '';
  profileId = '';
  originUrl = environment.webUrl + 'page/';

  pageForm = new FormGroup({
    profileId: new FormControl(),
    CommunityName: new FormControl(''),
    CommunityDescription: new FormControl(''),
    slug: new FormControl('', [Validators.required]),
    pageType: new FormControl('page', [Validators.required]),
    isApprove: new FormControl('Y', [Validators.required]),
    Country: new FormControl('US', [Validators.required]),
    Zip: new FormControl({ value: '', disabled: true }, Validators.required),
    State: new FormControl({ value: '', disabled: true }, Validators.required),
    City: new FormControl({ value: '', disabled: true }, Validators.required),
    County: new FormControl({ value: '', disabled: true }, Validators.required),
    logoImg: new FormControl('', Validators.required),
    coverImg: new FormControl('', Validators.required),
  });
  allCountryData: any;
  defaultCountry = 'US';
  @ViewChild('zipCode') zipCode: ElementRef;
  inputLinkValue1 = '';
  inputLinkValue2 = '';
  advertizement = {
    communityId: null,
    link1: null,
    link2: null
  }

  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private toastService: ToastService,
    private customerService: CustomerService,
    private uploadService: UploadFilesService,
    private sharedService: SharedService
  ) {
    this.userId = window.sessionStorage.user_id;
    this.profileId = localStorage.getItem('profileId');
  }

  ngOnInit(): void {
    this.getAllCountries()

    if (this.data.Id) {
      this.pageForm.patchValue({
        profileId: this.data?.profileId,
        CommunityName: this.data?.CommunityName,
        CommunityDescription: this.data?.CommunityDescription,
        slug: this.data?.slug,
        pageType: this.data?.pageType,
        isApprove: this.data?.isApprove,
        Country: this.data?.Country,
        Zip: this.data?.Zip,
        State: this.data?.State,
        City: this.data?.City,
        County: this.data?.County,
        logoImg: this.data?.logoImg,
        coverImg: this.data?.coverImg,
      });
      this.pageForm.get('State').enable();
      this.pageForm.get('City').enable();
      this.pageForm.get('County').enable();
      console.log(this.data);
    }
  }

  ngAfterViewInit(): void {
    fromEvent(this.zipCode.nativeElement, 'input')
      .pipe(debounceTime(1000))
      .subscribe((event) => {
        const val = event['target'].value;
        if (val.length > 3) {
          this.onZipChange(val);
        }
      });
  }

  selectFiles(event, type) {
    this.selectedFile = event.target.files;
    // this.uploadImgAndSubmit(this.selectedFile, type);
  }

  // upload(file, defaultType): any {
  //   if (file.size / (1024 * 1024) > 5) {
  //     return 'Image file size exceeds 5 MB!';
  //   }
  //   this.spinner.show();
  //   this.communityService
  //     .upload(file[0], this.profileId, defaultType)
  //     .subscribe(
  //       {
  //         next: (res: any) => {
  //           this.spinner.hide();
  //           if (res.body) {
  //             if (defaultType === 'community-logo') {
  //               this.logoImg = res?.body?.url;
  //             } else if (defaultType === 'community-cover') {
  //               this.coverImg = res?.body?.url;
  //             }
  //           }
  //         },
  //         error:
  //           (err) => {
  //             this.spinner.hide();
  //             this.selectedFile = undefined;
  //             return 'Could not upload the file:' + file.name;
  //           }
  //       }
  //     );
  // }

  uploadImgAndSubmit(): void {
    this.pageForm.get('profileId').setValue(this.profileId);
    let uploadObs = {};
    if (this.logoImg?.file?.name) {
      uploadObs['logoImg'] = this.uploadService.uploadFile(this.logoImg?.file);
    }

    if (this.coverImg?.file?.name) {
      uploadObs['coverImg'] = this.uploadService.uploadFile(this.coverImg?.file);
    }

    if (Object.keys(uploadObs)?.length > 0) {
      this.spinner.show();

      forkJoin(uploadObs).subscribe({
        next: (res: any) => {
          if (res?.logoImg?.body?.url) {
            this.logoImg['file'] = null;
            this.logoImg['url'] = res?.logoImg?.body?.url;
            this.pageForm.get('logoImg').setValue(res?.logoImg?.body?.url)

          }

          if (res?.coverImg?.body?.url) {
            this.coverImg['file'] = null;
            this.coverImg['url'] = res?.coverImg?.body?.url;
            this.pageForm.get('coverImg').setValue(res?.coverImg?.body?.url)

          }

          this.spinner.hide();
          this.onSubmit();
        },
        error: (err) => {
          this.spinner.hide();
        },
      });
    } else {
      this.onSubmit();
    }
  }

  onSubmit() {
    if (!this.data.Id) {
      this.spinner.show();
      if (this.pageForm.valid) {
        this.communityService.createCommunity(this.pageForm.value).subscribe(
          {
            next: (res: any) => {
              this.spinner.hide();
              if (!res.error) {
                this.submitted = true;
                this.createAdvertizeMentLink(res.data);
                this.createCommunityAdmin(res.data);
                this.activeModal.close('success');
                this.toastService.success('Health Topic created successfully');
                // this.router.navigateByUrl('/home');
              }
            },
            error:
              (err) => {
                this.toastService.danger('Please change topic name. this topic name already in use.');
                this.spinner.hide();
              }
          });
          if (this.data.link1 || this.data.link2) {
            this.editAdvertizeMentLink(this.data.Id);
          } else {
            this.createAdvertizeMentLink(this.data.Id);
          }
          this.sharedService.advertizementLink = [];
      } else {
        this.spinner.hide();
        this.toastService.danger('Please enter mandatory fields(*) data.');
      }
    } else {
      if (this.pageForm.valid && this.data.Id) {
        this.communityService.editCommunity(this.pageForm.value, this.data.Id).subscribe(
          {
            next: (res: any) => {
              this.spinner.hide();
              if (!res.error) {
                this.submitted = true;
                // this.createCommunityAdmin(res.data);
                this.toastService.success('Your Health Topic edit successfully!');
                this.activeModal.close('success');
              }
            },
            error:
              (err) => {
                this.toastService.danger('Please change topic name. this topic name already in use.');
                this.spinner.hide();
              }
          });
      }
    }
  }

  createAdvertizeMentLink(id) {
    if (id && (this.advertizement.link1 || this.advertizement.link2)) {
      this.advertizement.communityId = id
      this.communityService.createAdvertizeMentLink(this.advertizement).subscribe({
        next: (res => {
          console.log(res);
        }),
        error: (err => {
          console.log(err)
        })
      })
    }
  }

  editAdvertizeMentLink(id) {
    if (id && (this.advertizement.link1 || this.advertizement.link2)) {
      const data = {
        communityId: id,
        link1: this.advertizement.link1 || null,
        link2: this.advertizement.link2 || null
      }
      this.communityService.editAdvertizeMentLink(data).subscribe({
        next: (res => {
          console.log(res);
        }),
        error: (err => {
          console.log(err)
        })
      })
    }
  }

  getProfilePic() {
    // this.spinner.show();
    this.communityService.getLogoImg(this.userId).subscribe(
      {
        next: (res: any) => {
          if (res.length) {
            // this.spinner.hide();
            this.logoImg = res[0];
          }
        },
        error:
          (error) => {
            console.log(error);
          }
      });
    this.communityService.getCoverImg(this.userId).subscribe(
      {
        next: (res: any) => {
          if (res) {
            // this.spinner.hide();
            this.coverImg = res[0];
          }
        },
        error:
          (error) => {
            // this.spinner.hide();
            console.log(error);
          }
      });
  }

  createCommunityAdmin(id): void {
    const data = {
      profileId: this.profileId,
      communityId: id,
      isActive: 'Y',
      isAdmin: 'Y',
    };
    this.communityService.joinCommunity(data).subscribe(
      {
        next: (res: any) => {
          if (res) {
            return res;
          }
        },
        error:
          (error) => {
            console.log(error);
          }
      });
  }

  onLogoImgChange(event: any): void {
    this.logoImg = event;
  }

  onCoverImgChange(event: any): void {
    this.coverImg = event;
  }

  onCommunityNameChange(): void {
    const slug = slugify(this.pageForm.get('CommunityName').value);
    this.pageForm.get('slug').setValue(slug)
  }

  getAllCountries() {
    this.spinner.show();

    this.customerService.getCountriesData().subscribe({
      next: (result) => {
        this.spinner.hide();
        this.allCountryData = result;
        this.pageForm.get('Zip').enable();
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  changeCountry() {
    this.pageForm.get('Zip').setValue('');
    this.pageForm.get('State').setValue('');
    this.pageForm.get('City').setValue('');
    this.pageForm.get('County').setValue('');
    // this.registerForm.get('Place').setValue('');
  }

  onZipChange(event) {
    this.spinner.show();
    this.customerService
      .getZipData(event, this.pageForm.get('Country').value)
      .subscribe(
        (data) => {
          if (data[0]) {
            const zipData = data[0];
            this.pageForm.get('State').enable();
            this.pageForm.get('City').enable();
            this.pageForm.get('County').enable();
            this.pageForm.patchValue({
              State: zipData.state,
              City: zipData.city,
              County: zipData.places,
            });
          } else {
            this.pageForm.get('State').disable();
            this.pageForm.get('City').disable();
            this.pageForm.get('County').disable();
            this.toastService.danger(data?.message);
          }

          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          console.log(err);
        }
      );
  }
  onTagUserInputChangeEvent(data: any): void {
    this.advertizement.link1 = data?.meta?.url
    console.log(data)
  }
  onTagUserInputChangeEvent1(data): void {
    this.advertizement.link2 = data?.meta?.url
    console.log(data)
  }
}
