import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../../services/post.service';
import { forkJoin } from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-video-post-modal',
  templateUrl: './video-post-modal.component.html',
  styleUrls: ['./video-post-modal.component.scss'],
})
export class VideoPostModalComponent implements AfterViewInit {
  @Input() cancelButtonLabel: string = 'Cancel';
  @Input() confirmButtonLabel: string = 'Confirm';
  @Input() title: string = 'Confirmation Dialog';
  @Input() message: string;
  @Input() post: any = [];
  @Input() communityId: any;
  postData: any = {
    profileid: null,
    communityId: null,
    postdescription: '',
    tags: [],
    imageUrl: '',
    videoduration: null,
    thumbfilename: null,
    streamname: null,
    posttype: 'V',
    albumname: '',
    file1: {},
    file2: {},
    keywords: '',
  };
  selectedVideoFile: any;
  selectedThumbFile: any;
  postMessageTags: any[];
  postMessageInputValue: string = '';
  progressValue = 0;
  isProgress = false;

  streamnameProgress = 0;
  thumbfilenameProgress = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) {
    this.postData.profileid = localStorage.getItem('profileId');
    // console.log('profileId', this.postData.profileid);
  }
  ngAfterViewInit(): void {
    // console.log('editPreview', this.post);
    if (this.post) {
      this.postData.id = this.post.id;
      this.postData.profileid = this.post.profileid;
      this.postData.albumname = this.post.albumname;
      this.postMessageInputValue = this.post?.postdescription;
      this.selectedThumbFile = this.post?.thumbfilename;
      this.selectedVideoFile = this.post?.streamname;
      this.postData.streamname = this.selectedVideoFile
      this.postData.thumbfilename = this.selectedThumbFile
      this.postData.videoduration = this.post?.videoduration;
      this.postData.keywords = this.post?.keywords;
    }
  }

  // uploadImgAndSubmit1(): void {
  //   if (this.postData.videoduration > 121) {
  //     this.toastService.danger('Please upload less then 2minutes video!');
  //   } else {
  //     if (
  //       this.postData?.profileid &&
  //       this.postData.postdescription &&
  //       this.postData.albumname &&
  //       this.postData.keywords &&
  //       (this.postData.file1 || this.selectedVideoFile) &&
  //       (this.postData.file2 || this.selectedThumbFile)
  //     ) {
  //       this.startProgress();
  //       this.isProgress = true;
  //       let uploadObs = {};
  //       if (this.postData?.file1?.name) {
  //         uploadObs['streamname'] = this.postService.uploadFile(
  //           this.postData?.file1
  //         );
  //       }

  //       if (this.postData?.file2?.name) {
  //         uploadObs['thumbfilename'] = this.postService.uploadFile(
  //           this.postData?.file2
  //         );
  //       }

  //       if (Object.keys(uploadObs)?.length > 0) {
  //         // this.spinner.show();
  //         forkJoin(uploadObs).subscribe({
  //           next: (res: any) => {
  //             if (res?.streamname?.body?.url) {
  //               this.postData['file1'] = null;
  //               this.postData['streamname'] = res?.streamname?.body?.url;
  //             }
  //             if (res?.thumbfilename?.body?.url) {
  //               this.postData['file2'] = null;
  //               this.postData['thumbfilename'] = res?.thumbfilename?.body?.url;
  //             }
  //             this.spinner.hide();
  //             this.createPost();
  //           },
  //           error: (err) => {
  //             this.spinner.hide();
  //           },
  //         });
  //       } else {
  //         this.postData.streamname = this.selectedVideoFile;
  //         this.postData.thumbfilename = this.selectedThumbFile;
  //         this.createPost();
  //       }
  //     } else {
  //       this.toastService.danger('Please enter mandatory fields(*) data.');
  //     }
  //   }
  // }
  
  uploadImgAndSubmit(): void {
    if (this.postData.videoduration > 121) {
          this.toastService.danger('Please upload less then 2minutes video!');
        } else {
          if (
            this.postData?.profileid &&
            this.postData.postdescription &&
            this.postData.albumname &&
            this.postData.keywords &&
            (this.postData.file1 || this.selectedVideoFile) &&
            (this.postData.file2 || this.selectedThumbFile)
          ) {
            if (this.postData?.file1?.name || this.postData?.file2?.name) {
              if (this.postData?.file1?.name) {
                this.isProgress = true;
                this.postService.uploadFile(this.postData?.file1).subscribe((event) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    this.streamnameProgress = Math.round(
                      (100 * event.loaded) / event.total
                    );
                    this.cdr.markForCheck();
                    this.progressValue = this.streamnameProgress;
                    // console.log(`Streamname Progress: ${this.streamnameProgress}%`);
                  } else if (event.type === HttpEventType.Response) {
                    if (event.body?.url) {
                      this.postData['file1'] = null;
                      this.postData['streamname'] = event.body.url;
                      if (!this.postData.id && this.thumbfilenameProgress === 100 && this.streamnameProgress === 100) {
                        this.createPost();
                      } else if (this.postData.id && this.streamnameProgress === 100) {
                        this.createPost();
                      }
                    }
                  }
                });
              }
              if (this.postData?.file2?.name) {
                if (this.postData.id) {
                  this.spinner.show();
                }
                this.postService.uploadFile(this.postData?.file2).subscribe((event) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    this.thumbfilenameProgress = Math.round(
                      (100 * event.loaded) / event.total
                    );
                    // console.log(
                    //   `Thumbfilename Progress: ${this.thumbfilenameProgress}%`
                    // );
                  } else if (event.type === HttpEventType.Response) {
                    if (event.body?.url) {
                      this.postData['file2'] = null;
                      this.postData['thumbfilename'] = event.body.url;
                    }
                    if (this.postData?.id && this.thumbfilenameProgress === 100 && !this.streamnameProgress) {
                      this.spinner.hide();
                      this.postData.streamname = this.selectedVideoFile
                      this.createPost();
                    }
                  }
                });
              }
            } else {
              if (this.postData?.id) {
                this.postData.streamname = this.selectedVideoFile;
                this.postData.thumbfilename = this.selectedThumbFile;
                this.createPost();
              }
            }
          } else {
            this.toastService.danger('Please enter mandatory fields(*) data.');
          }
        }
  }

  startProgress() {
    const interval = setInterval(() => {
      if (this.progressValue < 92) {
        this.progressValue =
          this.progressValue > 95
            ? this.progressValue
            : this.progressValue + Math.floor(Math.random() * 10);
      }
      if (this.progressValue >= 98) {
        clearInterval(interval);
      }
    }, 1000);
  }

  onTagUserInputChangeEvent(data: any): void {
    this.postData.postdescription = data?.html;
    this.postMessageTags = data?.tags;
  }

  getTagUsersFromAnchorTags = (anchorTags: any[]): any[] => {
    const tags = [];
    for (const key in anchorTags) {
      if (Object.prototype.hasOwnProperty.call(anchorTags, key)) {
        const tag = anchorTags[key];

        tags.push({
          id: tag?.getAttribute('data-id'),
          name: tag?.innerHTML,
        });
      }
    }

    return tags;
  };

  createPost(): void {
    // this.progressValue = 100;
    this.spinner.show();
    this.postData.communityId = this.communityId || null;
    if (
      this.postData?.streamname &&
      this.postData.thumbfilename &&
      this.postData.postdescription &&
      this.postData.keywords &&
      this.postData.albumname
    ) {
      console.log('post-data', this.postData);
      this.spinner.hide();
      this.activeModal.close();
      this.socketService.createOrEditPost(this.postData
      //   , (data) => {
      //   this.spinner.hide();
      //   this.toastService.success('Post created successfully.');
      //   this.postData = null;
      //   return data;
      // }
      );
      // this.postService.createVideoPost(this.postData).subscribe({
      //   next: (res: any) => {
      // this.spinner.hide()
      //   }, error: (error) => {
      //     this.spinner.hide()
      //     console.log(error);
      //   }
      // })
    } else {
      // this.toastService.danger('Please enter mandatory fields(*) data.');
    }
  }

  onSelectedVideo(event: any) {
    if (event.target?.files?.[0].type.includes('video/mp4')) {
      this.postData.file1 = event.target?.files?.[0];
      this.selectedVideoFile = URL.createObjectURL(event.target.files[0]);
    } else {
      // this.toastService.warring('please upload only mp4 files');
    }
  }
  onFileSelected(event: any) {
    this.postData.file2 = event.target?.files?.[0];
    this.selectedThumbFile = URL.createObjectURL(event.target.files[0]);
  }

  removePostSelectedFile(): void {
    this.selectedThumbFile = null;
  }
  removeVideoSelectedFile(): void {
    this.selectedVideoFile = null;
  }

  onvideoPlay(e: any): void {
    this.postData.videoduration = e?.target?.duration;
    // console.log('videoduration', e?.target?.duration);
  }

  onChangeTag(event) {
    this.postData.keywords = event.target.value.replaceAll(' ', ',').replaceAll(/\s*,+\s*/g, ',').replaceAll(/\s*,+\s*/g, ',');
  }

  stopUploadVideo(){
    // this.postData = null
    this.activeModal.close()
    location.reload();
  }
}
