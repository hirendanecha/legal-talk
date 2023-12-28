import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, fromEvent } from 'rxjs';
import { Customer } from 'src/app/@shared/constant/customer';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { UploadFilesService } from 'src/app/@shared/services/upload-files.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  customer = new Customer();
  useDetails: any = {};
  isragister = false;
  registrationMessage = '';
  confirm_password = '';
  msg = '';
  userId = '';
  submitted = false;
  allCountryData: any;
  type = 'danger';
  defaultCountry = 'US';
  profilePic = '';
  profileImg: any = {
    file: null,
    url: '',
  };

  @ViewChild('zipCode') zipCode: ElementRef;

  registerForm = new FormGroup({
    FirstName: new FormControl(''),
    LastName: new FormControl(''),
    Username: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required]),
    MobileNo: new FormControl('', [Validators.required]),
    Country: new FormControl('US', [Validators.required]),
    Zip: new FormControl({ value: '', disabled: true }, Validators.required),
    State: new FormControl({ value: '', disabled: true }, Validators.required),
    City: new FormControl({ value: '', disabled: true }, Validators.required),
    County: new FormControl({ value: '', disabled: true }, Validators.required),
    TermAndPolicy: new FormControl(false, Validators.required),
  });

  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private uploadService: UploadFilesService,
    private toastService: ToastService,
    private seoService: SeoService
  ) {
    const data = {
      title: 'HealingTube Registration',
      url: `${environment.webUrl}sign-up`,
      description: 'Registration page',
      image: `${environment.webUrl}assets/images/landingpage/Healing-Tube-Logo.png`,
    };
    // this.seoService.updateSeoMetaData(data);
  }

  ngOnInit(): void {
    this.getAllCountries();
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

  selectFiles(event) {
    this.profileImg = event;
  }

  upload(file) {
    // if (file.size / (1024 * 1024) > 5) {
    //   return 'Image file size exceeds 5 MB!';
    // }
    this.spinner.show();
    this.uploadService.uploadFile(file).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.body) {
          this.profilePic = res?.body?.url;
          this.creatProfile(this.registerForm.value);
        }
        // if (file?.size < 5120000) {
        // } else {
        //   this.toastService.warring('Image is too large!');
        // }
      },
      error: (err) => {
        this.spinner.hide();
        this.profileImg = {
          file: null,
          url: '',
        };
        return 'Could not upload the file:' + file.name;
      },
    });
  }

  save() {
    this.spinner.show();

    this.customerService.createCustomer(this.registerForm.value).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        if (!data.error) {
          this.submitted = true;
          window.sessionStorage.user_id = data.data;
          this.registrationMessage =
            'Your account has registered successfully. Kindly login with your email and password !!!';
          this.scrollTop();
          this.isragister = true;
          const id = data.data;
          if (id) {
            this.upload(this.profileImg?.file);
            localStorage.setItem('register', String(this.isragister));
            this.router.navigateByUrl('/login?isVerify=false');
          }
        }
      },
      error: (err) => {
        this.registrationMessage = err.error.message;
        this.type = 'danger';
        this.spinner.hide();
        this.scrollTop();
      },
    });
  }

  validatepassword(): boolean {
    const pattern = '[a-zA-Z0-9]{5,}';
    // const pattern =
    //   '(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z])(?=.*[0-9].*[0-9]).{8}';

    if (!this.registerForm.get('Password').value.match(pattern)) {
      this.msg = 'Password must be a minimum of 5 characters';
      // this.msg =
      //   'Password must be a minimum of 8 characters and include one uppercase letter, one lowercase letter, and one special character';
      this.scrollTop();
      return false;
    }

    if (
      this.registerForm.get('Password').value !==
      this.registerForm.get('confirm_password').value
    ) {
      this.msg = 'Passwords do not match';
      this.scrollTop();
      return false;
    }

    return true;
  }

  onSubmit(): void {
    this.msg = '';
    if (!this.profileImg?.file?.name) {
      this.msg = 'Please upload profile picture';
      this.scrollTop();
      // return false;
    }
    if (
      this.registerForm.valid &&
      this.profileImg?.file?.name &&
      this.registerForm.get('TermAndPolicy').value === true
    ) {
      if (!this.validatepassword()) {
        return;
      }

      const id = this.route.snapshot.paramMap.get('id');
      if (this.userId) {
        // this.updateCustomer();
      } else {
        // this.submitted = true;
        this.save();
      }
    } else {
      this.msg = 'Please enter mandatory fields(*) data.';
      this.scrollTop();
      // return false;
    }

    // if (
    //  this.registerForm.invalid ||
    //   this.registerForm.get('termAndPolicy')?.value === false ||
    //   !this.profileImg?.file?.name
    // ) {
    //   this.msg =
    //     'Please enter mandatory fields(*) data and please check terms and conditions.';
    //   this.scrollTop();
    //   return false;
    // }
  }

  changeCountry() {
    this.registerForm.get('Zip').setValue('');
    this.registerForm.get('State').setValue('');
    this.registerForm.get('City').setValue('');
    this.registerForm.get('County').setValue('');
  }

  getAllCountries() {
    this.spinner.show();

    this.customerService.getCountriesData().subscribe({
      next: (result) => {
        this.spinner.hide();
        this.allCountryData = result;
        this.registerForm.get('Zip').enable();
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  onZipChange(event) {
    this.spinner.show();
    this.customerService
      .getZipData(event, this.registerForm.get('Country').value)
      .subscribe(
        (data) => {
          if (data[0]) {
            const zipData = data[0];
            this.registerForm.get('State').enable();
            this.registerForm.get('City').enable();
            this.registerForm.get('County').enable();
            this.registerForm.patchValue({
              State: zipData.state,
              City: zipData.city,
              County: zipData.places,
            });
          } else {
            this.registerForm.get('State').disable();
            this.registerForm.get('City').disable();
            this.registerForm.get('County').disable();
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

  changetopassword(event) {
    event.target.setAttribute('type', 'password');
    this.msg = '';
  }

  creatProfile(data) {
    this.spinner.show();
    const profile = {
      Username: data?.Username,
      FirstName: data?.FirstName,
      LastName: data?.LastName,
      Address: data?.Address,
      Country: data?.Country,
      City: data?.City,
      State: data?.State,
      County: data?.County,
      Zip: data?.Zip,
      MobileNo: data?.MobileNo,
      UserID: window?.sessionStorage?.user_id,
      IsActive: 'N',
      ProfilePicName: this.profilePic,
    };
    console.log(profile);

    this.customerService.createProfile(profile).subscribe({
      next: (data: any) => {
        this.spinner.hide();

        if (data) {
          const profileId = data.data;
          localStorage.setItem('profileId', profileId);
        }
      },
      error: (err) => {
        this.spinner.hide();
      },
    });
  }

  clearProfileImg(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    this.profileImg = {
      file: null,
      url: '',
    };
  }

  scrollTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  onChangeTag(event) {
    this.registerForm.get('Username').setValue(event.target.value.replaceAll(' ', ''));
  }
}
