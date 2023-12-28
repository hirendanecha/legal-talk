import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-claim-token-modal',
  templateUrl: './claim-token-modal.component.html',
  styleUrls: ['./claim-token-modal.component.scss']
})
export class ClaimTokenModalComponent {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() closeIcon: boolean | undefined;
  constructor(
    public activeModal: NgbActiveModal
  ) { }
}
