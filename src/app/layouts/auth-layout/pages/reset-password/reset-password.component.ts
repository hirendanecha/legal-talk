import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/@shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  @ViewChild('changePassword') changePassword: NgForm | any;
  showPassword = false;
  loading = false;
  submitted = false;
  msg = '';
  type = '';
  userAccessToken: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.userAccessToken = params['accesstoken'];
    });

    this.spinner.hide();
  }

  mustMatch() {
    if (
      this.changePassword.form.controls['newPassword'].value !== '' &&
      this.changePassword.form.controls['confirmPassword'].value !== ''
    ) {
      if (
        this.changePassword.form.controls['newPassword'].value !==
        this.changePassword.form.controls['confirmPassword'].value
      ) {
        this.changePassword.form.controls['confirmPassword'].setErrors({
          mustmatch: true,
        });
      } else {
        this.changePassword.form.controls['confirmPassword'].setErrors(null);
      }
    }
  }

  validatepassword(): boolean {
    const pattern =
      '[a-zA-Z0-9]{5,}';
    // const pattern =
    //   '(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z])(?=.*[0-9].*[0-9]).{8}';

    if (!this.changePassword.form.controls['newPassword'].value.match(pattern)) {
      this.msg =
        'Password must be a minimum of 5 characters';
        this.type = 'danger'
      // this.msg =
      //   'Password must be a minimum of 8 characters and include one uppercase letter, one lowercase letter, and one special character';
      return false;
    }
   return true;
  }

  forgotPasswordSubmit(form: NgForm) {
    localStorage.setItem('auth-token', this.userAccessToken);
    this.submitted = true;
    if (form.form.invalid) {
      return;
    }
    this.loading = true;
    this.authService
      .setPassword({
        token: this.userAccessToken,
        password: this.changePassword.form.controls['confirmPassword'].value,
      })
      .subscribe({
        next: (result) => {
          this.submitted = false;
          this.loading = false;
          this.msg = 'New password set successfully!';
          this.type = 'success';
          this.changePassword.reset();
          // setTimeout(() => {
          // }, 2300);
          localStorage.clear();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading = false;
          this.submitted = false;
          this.msg = 'Something went wrong please try again.';
          this.type = 'danger';
        },
      });
  }
}
