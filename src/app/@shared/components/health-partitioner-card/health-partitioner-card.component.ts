import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { ToastService } from 'src/app/@shared/services/toast.service';

@Component({
  selector: 'app-health-partitioner-card',
  templateUrl: './health-partitioner-card.component.html',
  styleUrls: ['./health-partitioner-card.component.scss'],
})
export class HealthPraatitionerCardComponent {
  @Input('community') community: any = {};
  @Input('type') type: string = '';
  @Output('getCommunities') getCommunities: EventEmitter<void> =
    new EventEmitter<void>();

  profileId: number = null;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private communityService: CommunityService,
    private toastService: ToastService
  ) {
    this.profileId = Number(localStorage.getItem('profileId'));
  }

  goToCommunityDetailPage(): void {
    if (this.community.pageType === 'page') {
      this.router.navigate(['pages', this.community?.slug]);
    } else {
      if (this.community?.isApprove === 'Y') {
        this.router.navigate(['health-practitioner']);
      } else {
        this.toastService.danger('This community not approve yet.');
      }
    }
  }

  joinCommunity(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    const data = {
      profileId: this.profileId,
      communityId: this.community.Id,
      IsActive: 'Y',
    };

    this.communityService.joinCommunity(data).subscribe({
      next: (res: any) => {
        if (res) {
          this.goToCommunityDetailPage();
        }
      },
    });
  }

  deleteOrLeaveCommunity(event: any, type = ''): void {
    event.stopPropagation();
    event.preventDefault();

    let actionType = '';
    let actionObs = null;
    console.log(type);
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    if (type === 'my') {
      actionType = 'Delete';
      actionObs = this.communityService.deleteCommunity(this.community?.Id);
    } else {
      actionType = 'Leave';
      actionObs = this.communityService.removeFromCommunity(
        this.community?.Id,
        this.profileId
      );
    }

    modalRef.componentInstance.title = `${actionType} ${this.community.pageType}`;
    modalRef.componentInstance.confirmButtonLabel = actionType;
    modalRef.componentInstance.message = `Are you sure want to ${actionType.toLowerCase()} this ${this.community.pageType
      }?`;

    modalRef.result.then((res) => {
      if (res === 'success') {
        actionObs.subscribe({
          next: (res: any) => {
            if (res) {
              this.toastService.success(
                `${this.community?.pageType} ${res.message} `
              );
              this.getCommunities?.emit();
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
