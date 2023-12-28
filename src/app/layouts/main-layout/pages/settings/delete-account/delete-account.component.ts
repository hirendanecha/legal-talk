import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/@shared/modals/confirmation-modal/confirmation-modal.component';
import { Customer } from 'src/app/@shared/constant/customer';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountComponent implements OnInit {
  customer = new Customer();
  profileId: number;
  userId: number;
  constructor(
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {
    this.userId = +localStorage.getItem('user_id');
    this.profileId = +localStorage.getItem('profileId');
  }

  ngOnInit(): void { }

  getProfile(id): void {
    this.spinner.show();
    this.customerService.getProfile(id).subscribe(
      {
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            this.customer = res.data[0];
          }
        },
        error:
          (error) => {
            this.spinner.hide();
            console.log(error);
          }
      });
  }

  deleteAccount(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Delete Account';
    modalRef.componentInstance.confirmButtonLabel = 'Delete';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to delete your account?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.customerService.deleteCustomer(this.userId, this.profileId).subscribe({
          next: (res: any) => {
            if (res) {
              this.toastService.success(res.message || 'Account deleted successfully');
              this.tokenStorageService.signOut();
              this.router.navigateByUrl('register');
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
}
