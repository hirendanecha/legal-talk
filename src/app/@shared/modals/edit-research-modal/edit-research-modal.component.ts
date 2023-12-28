import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  deleteExtraParamsFromReqObj,
  isFormSubmittedAndError,
  numToRevArray,
} from 'src/app/@shared/utils/utils';
import { ProfileService } from '../../services/profile.service';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../../services/post.service';
import { ToastService } from '../../services/toast.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-edit-research-modal',
  templateUrl: './edit-research-modal.component.html',
  styleUrls: ['./edit-research-modal.component.scss']
})
export class EditResearchModalComponent implements OnInit, AfterViewInit {
  @Input() cancelButtonLabel: string | undefined = 'Cancel';
  @Input() confirmButtonLabel: string | undefined = 'Save';
  @Input() title: string | undefined = 'Edit Details';
  @Input() message: string | undefined;
  @Input() data: any = [];

  constructor(
    public activeModal: NgbActiveModal,
    private profileService: ProfileService,
    private postService: PostService,
    public sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService,
  ) {
    this.getGroups()
  }
  researches: any = [];
  btnGroupFeedTypeCtrl: FormControl;
  btnGroupViewTypeCtrl: FormControl;

  selectedImgFile: any;
  selectedpdfFile: any;

  groupPosts: any = [];
  pagination: any = {
    page: 0,
    limit: 0,
    limitArray: [],
  };
  isGroupPostsLoader: boolean = false;

  tagInputDefaultData: string = '';
  tagInputDefaultPostData: string = '';

  researchForm = new FormGroup({
    posttoprofileid: new FormControl('', [Validators.required]),
    textpostdesc: new FormControl(''),
    postdescription: new FormControl('', [Validators.required]),
    keywords: new FormControl(''),
    posttype: new FormControl('R'),
    meta: new FormControl(null),
    isClicked: new FormControl(false),
    isSubmitted: new FormControl(false),
  });

  postImageUrl: string;
  postImage: any;

  postFileUrl: string;
  postFile: any;

  ngOnInit(): void {
    if (this.data) {
      this.researchForm.patchValue({
        posttoprofileid: this.data?.posttoprofileid,
        textpostdesc: this.data?.textpostdesc,
        postdescription: this.data?.postdescription,
        keywords: this.data?.keywords,
        posttype: this.data?.posttype,
        meta: this.data?.meta,
      });
      this.postImageUrl = this.data?.imageUrl
      // this.selectedImgFile = this.data?.imageUrl
      this.postFileUrl = this.data?.pdfUrl
      // this.selectedpdfFile = this.data?.pdfUrl
    }
  }

  ngAfterViewInit(): void {
    this.tagInputDefaultData = this.data?.postdescription;
    this.tagInputDefaultPostData = this.data?.textpostdesc;
    this.cdr.detectChanges();

    if (!this.socketService.socket?.connected) {
      this.socketService.socket?.connect();
    }
  }

  get formIsClicked(): FormControl {
    return this.researchForm.get('isClicked') as FormControl;
  }

  get formIsSubmitted(): FormControl {
    return this.researchForm.get('isSubmitted') as FormControl;
  }

  onTagUserInputDescription(data: any, ctrlName: string): void {
    this.researchForm.get(ctrlName).setValue(data?.html);
  }

  onTagUserInputChangeEvent(data: any, ctrlName: string): void {
    this.isGroupPostsLoader = true;
    if (data?.meta) {
      this.isGroupPostsLoader = false;
    }
    this.researchForm.get(ctrlName).setValue(data?.html);
    this.researchForm.get('meta').setValue(data?.meta || {});
    // console.log('data : ', data);

    // this.postData.postdescription = data?.html;
    // this.postMessageTags = data?.tags;
  }

  onChangeTag(event) {
    this.researchForm.get('keywords').setValue(event.target.value.replaceAll(' ', ','));
  }

  getGroups(): void {
    this.spinner.show();

    this.profileService.getGroups().subscribe({
      next: (res: any) => {
        if (res?.length > 0) {
          this.researches = res;
        }
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  createResearch(): void {
    this.formIsClicked.setValue(true);
    if (this.researchForm.invalid && this.formIsSubmitted.value === false) {
      this.toastService.danger('Please enter mandatory fields(*) data.');
      return;
    } else {
      this.formIsSubmitted.setValue(true);
      const reqObj = deleteExtraParamsFromReqObj(this.researchForm.value);
      const meta = { ...reqObj['meta'] };
      delete reqObj['meta'];
      reqObj['profileid'] = localStorage.getItem('profileId');
      reqObj['id'] = this.data.id;
      reqObj['title'] = meta?.title;
      reqObj['metadescription'] = meta?.metadescription;
      reqObj['metaimage'] = meta?.metaimage;
      reqObj['metalink'] = meta?.metalink;
      reqObj['imageUrl'] = this.postImage;
      reqObj['pdfUrl'] = this.postFile;

      this.socketService?.createOrEditPost(reqObj);
      this.activeModal.close();
      this.resetPost()
      // this.postService
      //   .createPost(reqObj)
      //   .subscribe({
      //     next: (res) => {
      //       if (res) {
      //         console.log('res : ', res);
      //         this.toastService.success('Research edit successfully.');
      //       } else {
      //         this.toastService.danger(res['message']);
      //       }
      //     },
      //     error: (error: any) => {
      //       this.toastService.danger(error.message);
      //     },
      //   })
      // .add(() => {
      //   this.researchForm.reset();
      //   this.tagInputDefaultData = 'reset';
      //   this.postImage = null;
      //   this.postFile = null;
      //   setTimeout(() => {
      //     this.tagInputDefaultData = '';
      //   }, 100);
      //   this.formIsClicked.setValue(false);
      //   this.formIsSubmitted.setValue(false);
      // });
    }
    this.removeImgFile()
  }

  isFormSubmittedAndError(
    controlName: string,
    errorName: string = '',
    notError: Array<string> = new Array()
  ): any {
    return isFormSubmittedAndError(
      this.researchForm,
      this.formIsClicked.value,
      controlName,
      errorName,
      notError
    );
  }
  formdata() {
    console.log(this.researchForm.value);
  }
  createImagePost(): void {
    const profileId = localStorage.getItem('profileId');
    if (this.selectedImgFile) {
      this.postService
        .upload(this.selectedImgFile, profileId, 'post')
        .subscribe({
          next: (res: any) => {
            if (res?.body?.url) {
              this.postImage = res?.body?.url;
              this.createResearch();
            }
          },
        });
    } else if (this.selectedpdfFile) {
      this.postService
        .upload(this.selectedpdfFile, profileId, 'post')
        .subscribe({
          next: (res: any) => {
            if (res?.body?.url) {
              this.postFile = res?.body?.url;
              this.createResearch();
            }
          },
        });
    } else {
      this.createResearch();
    }
  }

  onFileSelected(event: any) {
    const file = event.target?.files?.[0] || {};
    if (file) {
      this.postImageUrl = URL.createObjectURL(event.target.files[0]);
      this.selectedImgFile = file;
    }
    // if (file?.size < 5120000) {
    // } else {
    //   this.toastService.warring('Image is too large!');
    // }
  }

  removeImgFile(): void {
    this.selectedImgFile = null;
    this.postImageUrl = null;
  }

  onPostFileSelect(event: any): void {
    const file = event.target?.files?.[0] || {};
    console.log(file)
    if (file) {
      this.postFileUrl = URL.createObjectURL(event.target.files[0]);
      this.selectedpdfFile = file;
    }
    // if (file.type.includes("application/pdf")) {
    //   this.postData['file'] = file;
    //   this.pdfName = file?.name
    //   this.postData['imageUrl'] = null;
    //   this.postData['streamname'] = null;
    // } else {
    //   this.postData['file'] = file;
    //   this.postData['imageUrl'] = URL.createObjectURL(file);
    //   this.pdfName = null;
    //   this.postData['pdfUrl'] = null;
    // }
    // if (file?.size < 5120000) {
    // } else {
    //   this.toastService.warring('Image is too large!');
    // }
  }

  removePostSelectedFile(): void {
    this.selectedpdfFile = null;
    this.postFileUrl = null;
  }

  resetPost(): void {
    this.researchForm.reset();
    this.tagInputDefaultData = null;
    this.selectedImgFile = null;
    this.selectedpdfFile = null;
    setTimeout(() => {
      this.tagInputDefaultData = null;
    }, 100);
    Object.keys(this.researchForm.controls).forEach(key => {
      this.researchForm.get(key).setErrors(null);
    });
    console.log(this.researchForm.value)
  }
}
