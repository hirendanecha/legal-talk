import { AfterViewInit, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { PostService } from '../../services/post.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-share-post-modal',
  templateUrl: './share-post-modal.component.html',
  styleUrls: ['./share-post-modal.component.scss'],
})
export class SharePostModalComponent implements AfterViewInit {
  @Input() cancelButtonLabel: string | undefined = 'Cancel';
  @Input() confirmButtonLabel: string | undefined = 'Confirm';
  @Input() title: string | undefined = 'Confirmation Dialog';
  @Input() message: string | undefined;
  @Input() post: any = [];

  webUrl = environment.webUrl;
  tubeUrl = environment.tubeUrl;
  sharePost: any;
  metaData: any;

  postMessageInputValue: string = '';

  sharePostData: any = {
    profileid: '',
    postdescription: '',
    meta: {},
    tags: [],
    parentPostId: null
  };

  constructor(
    public activeModal: NgbActiveModal,
    private postService: PostService,
    public sharedService: SharedService
  ) {}

  ngAfterViewInit(): void {
    const profileId = localStorage.getItem('profileId');
    this.sharePostData.profileid = profileId;
    this.sharePostData.parentPostId = this.post.id;
    if (this.post.streamname) {
      this.sharePost = this.tubeUrl + 'video/' + this.post.id;
    } else {
      this.sharePost = this.webUrl + 'post/' + this.post.id;
    }
    // this.getMetaDataFromUrlStr();    
  }

  onTagUserInputChangeEvent(data: any): void {
    this.sharePostData.postdescription = data?.html;
    this.sharePostData.tags = data?.tags;
  }

  getMetaDataFromUrlStr(): void {
    if (this.sharePost) {
      const url = this.sharePost;
      this.postService.getMetaData({ url }).subscribe({
        next: (res: any) => {
          if (res?.meta?.image) {
            const urls = res.meta?.image?.url;
            const imgUrl = Array.isArray(urls) ? urls?.[0] : urls;
            this.sharePostData.meta = {
              title: res?.meta?.title,
              metadescription: res?.meta?.description,
              metaimage: imgUrl,
              metalink: res?.meta?.url || url,
              url: url,
            };
          }
        },
        error: () => {
          this.clearMetaData();
        },
      });
    }
  }
  clearMetaData(): void {
    this.metaData = {};
  }

  submit() {
    this.activeModal.close(this.sharePostData);
    this.clearMetaData()
  }
}
