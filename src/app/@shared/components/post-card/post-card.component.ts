import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  afterNextRender,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/@shared/services/post.service';
import { SeeFirstUserService } from 'src/app/@shared/services/see-first-user.service';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { UnsubscribeProfileService } from 'src/app/@shared/services/unsubscribe-profile.service';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { slideUp } from '../../animations/slideUp';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { ReplyCommentModalComponent } from '../../modals/reply-comment-modal/reply-comment-modal.component';
import { getTagUsersFromAnchorTags } from '../../utils/utils';
import { TokenStorageService } from '../../services/token-storage.service';
import { SeoService } from '../../services/seo.service';
import { BreakpointService } from '../../services/breakpoint.service';
import { EditResearchModalComponent } from '../../modals/edit-research-modal/edit-research-modal.component';
import { SharePostModalComponent } from '../../modals/share-post-modal/share-post-modal.component';

declare var jwplayer: any;
@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  animations: [slideUp],
})
export class PostCardComponent implements OnInit {
  @Input('post') post: any = {};
  @Input('seeFirstList') seeFirstList: any = [];
  @Output('getPostList') getPostList: EventEmitter<void> =
    new EventEmitter<void>();
  @Output('onEditPost') onEditPost: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('parentPostCommentElement', { static: false })
  parentPostCommentElement: ElementRef;

  profileId = '';
  isOpenCommentsPostId: number = null;

  commentList: any = [];
  replyCommentList: any = [];
  isReply = false;

  commentId = null;
  commentData: any = {
    file: null,
    url: '',
    tags: [],
    meta: {},
  };
  isParent: boolean = false;
  postComment = {};
  isCommentsLoader: boolean = false;
  editCommentsLoader: boolean = false;
  isPostComment: boolean = false;
  webUrl = environment.webUrl;
  tubeUrl = environment.tubeUrl;
  player: any;
  isExpand = false;
  commentCount = 0;
  commentMessageInputValue: string = '';
  replaycommentMessageInputValue: string = '';
  commentMessageTags: any[];
  showHoverBox = false;
  unSubscribeProfileIds: any = [];

  descriptionimageUrl: string;
  commentDescriptionimageUrl: string;
  replayCommentDescriptionimageUrl: string;
  shareButton = false;

  constructor(
    private seeFirstUserService: SeeFirstUserService,
    private unsubscribeProfileService: UnsubscribeProfileService,
    private socketService: SocketService,
    private postService: PostService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    public sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    public tokenService: TokenStorageService,
    private seoService: SeoService,
    public breakpointService: BreakpointService,
    public activeModal: NgbActiveModal
  ) {
    this.profileId = localStorage.getItem('profileId');
    afterNextRender(() => {

      if (this.post?.id && this.post?.posttype === 'V') {
        this.playVideo(this.post?.id);
      }
      this.socketListner();
      this.viewComments(this.post?.id);
      // const contentContainer = document.createElement('div');
      // contentContainer.innerHTML = this.post.postdescription;
      // const imgTag = contentContainer.querySelector('img');
      // if (imgTag) {
      //   const imgTitle = imgTag.getAttribute('title');
      //   if (!imgTitle) {
      //     this.descriptionimageUrl = imgTag.getAttribute('src');
      //   }
      // }
    });
  }

  ngOnInit(): void {
    // this.socketListner();
    // this.viewComments(this.post?.id);
  }

  ngAfterViewInit(): void {
    // if (this.post?.posttype === 'V') {
    //   this.playVideo(this.post?.id);
    // }
    this.descriptionimageUrl = this.extractImageUrlFromContent(
      this.post.postdescription
    );
    const path = this.route.snapshot.routeConfig.path;
    if (path === 'view-profile/:id' || path === 'post/:id') {
      this.shareButton = true;
    }
  }
  getPostUrl(post: any) {
    // if (post.streamname) {
    //   return this.tubeUrl + 'video/' + post.id;get-communities-pages
    // } else {
    //   return this.webUrl + 'post/' + post.id;
    // }
    const modalRef = this.modalService.open(SharePostModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Share post on Home';
    modalRef.componentInstance.confirmButtonLabel = 'Share';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.post = post;
    modalRef.result.then((res) => {
      if (res.profileid) {
        this.socketService?.createOrEditPost(res);
        this.toastService.success('Post create successfully');
      } else {
        if (res.profileid) {
          this.toastService.warring('Something went wrong please try again!');
        }
      }
    });
  }

  removeSeeFirstUser(id: number): void {
    this.seeFirstUserService.remove(Number(this.profileId), id).subscribe({
      next: (res) => {
        this.seeFirstList.pop(id);
        console.log(this.seeFirstList);
        this.toastService.warring('See First Stopped');
        this.getPostList?.emit();
      },
    });
  }

  seeFirst(postProfileId: number): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'See First User';
    modalRef.componentInstance.confirmButtonLabel = 'Yes';
    modalRef.componentInstance.cancelButtonLabel = 'No';
    modalRef.componentInstance.message =
      'Would you like to go to their profile?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.seeFirstUserService
          .create({
            profileId: this.profileId,
            seeFirstProfileId: postProfileId,
          })
          .subscribe({
            next: (res) => {
              this.router.navigate([`settings/view-profile/${postProfileId}`]);
              this.toastService.success('See first set');
              this.getPostList?.emit();
            },
          });
      }
    });
  }

  unsubscribe(post: any): void {
    // post['hide'] = true;

    this.unsubscribeProfileService
      .create({
        profileId: this.profileId,
        unsubscribeProfileId: post?.profileid,
      })
      .subscribe({
        next: (res) => {
          this.toastService.danger('Unsubscribe successfully');
          this.getPostList?.emit();
          return true;
        },
      });
  }

  goToViewProfile(id: any): void {
    this.router.navigate([`settings/view-profile/${id}`]);
  }

  editPost(post): void {
    if (this.onEditPost && !post.groupName) {
      this.onEditPost?.emit(post);
    }
    if (post.groupName) {
      // this.onEditPost?.emit(post);
      const modalRef = this.modalService.open(EditResearchModalComponent, {
        centered: true,
        size: 'lg',
      });
      modalRef.componentInstance.title = 'Edit Research Details';
      modalRef.componentInstance.confirmButtonLabel = 'Save';
      modalRef.componentInstance.cancelButtonLabel = 'Cancel';
      modalRef.componentInstance.data = post;
      modalRef.result.then((res) => {
        if (res) {
          // this.activeModal.close();
        }
      });
    }
  }

  editComment(comment): void {
    if (comment.parentCommentId) {
      const modalRef = this.modalService.open(ReplyCommentModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = 'Edit Comment';
      modalRef.componentInstance.confirmButtonLabel = 'Comment';
      modalRef.componentInstance.cancelButtonLabel = 'Cancel';
      modalRef.componentInstance.data = comment;
      modalRef.result.then((res) => {
        if (res) {
          this.commentData['tags'] = res?.tags;
          this.commentData.comment = res?.comment;
          this.commentData.postId = res?.postId;
          this.commentData.profileId = res?.profileId;
          this.commentData['id'] = res?.id;
          this.commentData.parentCommentId = res?.parentCommentId;
          this.commentData['file'] = res?.file;
          this.commentData['imageUrl'] = res?.imageUrl;
          this.uploadCommentFileAndAddComment();
        }
      });
    } else {
      // this.renderer.setProperty(
      //   this.parentPostCommentElement?.nativeElement,
      //   'innerHTML',
      //   comment.comment
      // );
      this.isReply = false;
      this.commentMessageInputValue = comment.comment;
      this.commentData['id'] = comment.id;
      if (comment.imageUrl) {
        this.commentData['imageUrl'] = comment.imageUrl;
        this.isParent = true;
      }
    }
    console.log(comment);
  }

  deletePost(post): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Delete Post';
    modalRef.componentInstance.confirmButtonLabel = 'Delete';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to delete this post?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        // this.socketService.deletePost({ id: post?.id }, data => {
        //   console.log('post-data', data)
        // });
        // this.getPostList.emit();
        // this.toastService.success('Post deleted successfully');
        // post['hide'] = true;
        this.postService.deletePost(post.id).subscribe({
          next: (res: any) => {
            if (res) {
              this.toastService.success(res.message);
              this.getPostList?.emit();
            }
          },
          error: (error) => {
            console.log('error : ', error);
          },
        });
      }
    });
  }

  reactLikeOnPost(post: any) {
    if (post.react != 'L') {
      post.likescount = post?.likescount + 1;
      post.totalReactCount = post?.totalReactCount + 1;
      post.react = 'L';
    }
    const data = {
      postId: post.id,
      profileId: this.profileId,
      likeCount: post.likescount,
      actionType: 'L',
      toProfileId: post.profileid,
    };
    this.likeDisLikePost(data);
  }

  dislikeFeedPost(post) {
    if (post.react == 'L' && post.likescount > 0) {
      post.likescount = post.likescount - 1;
      post.react = null;
      post.totalReactCount = post.totalReactCount - 1;
    }
    const data = {
      postId: post.id,
      profileId: this.profileId,
      likeCount: post.likescount,
      toProfileId: post.profileid,
    };
    this.likeDisLikePost(data);
  }

  likeDisLikePost(data): void {
    this.socketService.likeFeedPost(data, (res) => {
      console.log('likeOrDislike', res);
      return;
    });
  }

  viewComments(id: number): void {
    if (this.post.id === id) {
      this.editCommentsLoader = true;
      this.isOpenCommentsPostId = id;
      this.isCommentsLoader = true;
      const data = {
        postId: id,
        profileId: this.profileId,
      };
      this.postService.getComments(data).subscribe({
        next: (res) => {
          if (res) {
            this.post.commentCount = res.data?.count;
            res.data.commmentsList.filter((ele: any) => {
              ele.descImg = this.extractImageUrlFromContent(ele.comment);
            });

            // console.log(res.data.commmentsList);
            this.commentList = res.data.commmentsList.map((ele: any) => ({
              ...ele,
              replyCommnetsList: res.data.replyCommnetsList.filter(
                (ele1: any) => {
                  ele1.descImg = this.extractImageUrlFromContent(ele1.comment);
                  return ele.id === ele1.parentCommentId;
                }
              ),
            }));
            this.editCommentsLoader = false;

            this.commentList.forEach((element) => {
              this.commentDescriptionimageUrl = this.extractImageUrlFromContent(
                element.comment
              );
            });

            this.commentList.forEach((element) => {
              element.replyCommnetsList.forEach((ele) => {
                this.replayCommentDescriptionimageUrl =
                  this.extractImageUrlFromContent(ele.comment);
              });
            });
          }
        },
        error: (error) => {
          console.log(error);
          this.editCommentsLoader = false;
        },
        complete: () => {
          this.isCommentsLoader = false;
          this.editCommentsLoader = false;
        },
      });
    }
  }

  deleteComments(comment): void {
    this.spinner.show();
    this.postService.deleteComments(comment.id).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastService.success(res.message);
        this.viewComments(comment?.postId);
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
        this.toastService.danger(error.message);
      },
    });
  }

  showReplySection(id) {
    this.isReply = this.commentId == id ? false : true;
    this.commentId = id;
    if (!this.isReply) {
      this.commentId = null;
    }
  }

  likeComments(comment) {
    if (comment.react != 'L') {
      comment.likeCount = comment.likeCount + 1;
      comment.react = 'L';
    }
    const data = {
      postId: comment.postId,
      commentId: comment.id,
      profileId: Number(this.profileId),
      toProfileId: Number(comment.profileId),
      likeCount: comment.likeCount,
      actionType: 'L',
    };
    this.likeDisLikePostComment(data);
  }

  disLikeComments(comment) {
    if (comment.react == 'L' && comment.likeCount > 0) {
      comment.likeCount = comment.likeCount - 1;
      comment.react = null;
    }
    const data = {
      postId: comment.postId,
      commentId: comment.id,
      profileId: Number(this.profileId),
      toProfileId: Number(comment.profileId),
      likeCount: comment.likeCount,
    };
    this.likeDisLikePostComment(data);
  }

  likeDisLikePostComment(data): void {
    this.socketService.likeFeedComments(data, (res) => {
      return;
    });
  }

  commentOnPost(postId, commentId = null): void {
    this.commentData.tags = getTagUsersFromAnchorTags(this.commentMessageTags);
    console.log(this.commentData);
    if (this.isPostComment === false) {
      if (this.commentData.comment || this.commentData?.file?.name) {
        this.isPostComment = true;
        this.commentData.postId = postId;
        this.commentData.profileId = this.profileId;
        if (commentId) {
          this.commentData['parentCommentId'] = commentId;
        }
        this.uploadCommentFileAndAddComment();
      } else {
        this.toastService.clear();
        this.toastService.danger('Please enter comment');
      }
    }
  }

  uploadCommentFileAndAddComment(): void {
    if (this.commentData?.comment || this.commentData?.file?.name) {
      if (this.commentData?.file?.name) {
        this.spinner.show();
        this.postService
          .upload(this.commentData?.file, this.profileId)
          .subscribe({
            next: (res: any) => {
              this.spinner.hide();
              if (res?.body?.url) {
                this.commentData['file'] = null;
                this.commentData['imageUrl'] = res?.body?.url;
                this.addComment();
                this.commentMessageInputValue = null;
                this.replaycommentMessageInputValue = null;
              }
            },
            error: (err) => {
              this.spinner.hide();
            },
          });
      } else {
        this.addComment();
        this.commentMessageInputValue = null;
        this.replaycommentMessageInputValue = null;
      }
    }
  }

  addComment(): void {
    if (this.commentData) {
      this.socketService.commentOnPost(this.commentData, (data) => {
        this.postComment = '';
        this.commentData = {};
        this.commentData.comment = '';
        this.commentData.tags = [];
        this.commentMessageTags = [];
        // childPostCommentElement.innerText = '';
      });
      this.commentMessageInputValue = '';
      setTimeout(() => {
        this.commentMessageInputValue = '';
      }, 100);
      this.commentData = {};
      this.isReply = false;
      this.viewComments(this.post?.id);
    }
    //  else {
    //   this.socketService.commentOnPost(this.commentData, (data) => {
    //     this.toastService.success('comment added on post');
    //     this.commentData.comment = '';
    //     this.commentData = {}
    //     // parentPostCommentElement.innerText = '';
    //     return data;
    //   });
    // }
  }

  onPostFileSelect(event: any, type: string): void {
    if (type === 'parent') {
      this.isParent = true;
    } else {
      this.isParent = false;
    }
    const file = event.target?.files?.[0] || {};
    if (file.type.includes('image/')) {
      this.commentData['file'] = file;
      this.commentData['imageUrl'] = URL.createObjectURL(file);
    } else {
      this.toastService.danger(`sorry ${file.type} are not allowed!`);
    }
    // if (file?.size < 5120000) {
    // } else {
    //   this.toastService.warring('Image is too large!');
    // }
  }

  removePostSelectedFile(): void {
    this.commentData['file'] = null;
    this.commentData['imageUrl'] = '';
  }

  playVideo(id: any) {
    if (this.player) {
      this.player.remove();
    }
    const config = {
      file: this.post?.streamname,
      image: this.post?.thumbfilename,
      mute: false,
      autostart: false,
      volume: 30,
      height: '300px',
      width: 'auto',
      pipIcon: 'disabled',
      displaydescription: true,
      playbackRateControls: false,
      aspectratio: '16:9',
      autoPause: {
        viewability: false,
      },
      controls: true,
    };
    if (id) {
      const jwPlayer = jwplayer('jwVideo-' + id);
      if (jwPlayer) {
        this.player = jwPlayer?.setup({
          ...config,
        });
        this.player?.load();
      }
    }
  }

  onTagUserInputChangeEvent(data: any): void {
    // this.commentData.comment = data?.html;
    this.extractLargeImageFromContent(data.html);
    this.commentData.meta = data?.meta;
    this.commentMessageTags = data?.tags;
    // console.log(this.commentData)
  }
  onTagUserReplayInputChangeEvent(data: any): void {
    // this.commentData.comment = data?.html;
    this.extractLargeImageFromContent(data.html);
    this.commentData.meta = data?.meta;
    this.commentMessageTags = data?.tags;
  }

  socketListner(): void {
    this.socketService.socket?.on('likeOrDislike', (res) => {
      if (res[0]) {
        if (this.post.id === res[0]?.id) {
          this.post.likescount = res[0]?.likescount;
        }
      }
    });

    this.socketService.socket?.on('likeOrDislikeComments', (res) => {
      // console.log('likeOrDislikeComments', res);
      if (res[0]) {
        if (res[0].parentCommentId) {
          // let index = this.commentList.findIndex(obj => obj.id === res[0].parentCommentId);
          // let index1 = this.commentList.findIndex(obj => obj.replyCommnetsList.findIndex(ele => ele.id === res[0].id));
          // if (index1 !== -1 && index !== -1) {
          //   this.commentList[index].replyCommnetsList[index1].likeCount = res[0]?.likeCount;
          // }
          this.commentList.map((ele: any) =>
            res.filter((ele1) => {
              if (ele.id === ele1.parentCommentId) {
                let index = ele?.['replyCommnetsList']?.findIndex(
                  (obj) => obj?.id === res[0]?.id
                );
                if (index !== -1) {
                  return (ele['replyCommnetsList'][index].likeCount =
                    res[0]?.likeCount);
                } else {
                  return ele;
                }
              }
            })
          );
        } else {
          let index = this.commentList.findIndex(
            (obj) => obj?.id === res[0]?.id
          );
          if (index !== -1) {
            this.commentList[index].likeCount = res[0]?.likeCount;
          }
        }
        // if (this.post.id === res[0]?.id) {
        //   this.post.likescount = res[0]?.likescount;
        // }
      }
    });

    this.socketService.socket?.on('comments-on-post', (data: any) => {
      this.isPostComment = false;
      console.log('comments-on-post', data);
      if (data[0]?.parentCommentId) {
        this.commentList.map((ele: any) =>
          data.filter((ele1) => {
            if (ele?.id === ele1?.parentCommentId) {
              if (ele?.replyCommnetsList) {
                let index = ele?.['replyCommnetsList']?.findIndex(
                  (obj) => obj?.id === data[0]?.id
                );
                if (!ele?.['replyCommnetsList'][index]) {
                  ele?.['replyCommnetsList'].push(ele1);
                  return ele;
                } else {
                  ele['replyCommnetsList'][index] = ele1;
                  return ele;
                }
              } else {
                return ele;
              }
            }
          })
        );
        this.viewComments(data[0].postId);
      } else {
        let index = this.commentList.findIndex(
          (obj) => obj?.id === data[0]?.id
        );
        if (!this.commentList[index]) {
          this.commentList.push(data[0]);
          this.viewComments(data[0].postId);
        } else {
          // this.commentList[index] = data[0];
          this.viewComments(data[0].postId);
        }
      }
    });
  }

  pdfView(pdfUrl) {
    window.open(pdfUrl);
  }

  downloadPdf(pdf): void {
    const pdfLink = document.createElement('a');
    pdfLink.href = pdf;
    // window.open(pdf);
    // pdfLink.download = "TestFile.pdf";
    pdfLink.click();
  }

  extractImageUrlFromContent(content: string): string | null {
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
        return imgTag.getAttribute('src');
      }
    }
    return null;
  }

  selectedEmoji(emoji) {
    this.commentMessageInputValue =
      this.commentMessageInputValue +
      `<img src=${emoji} width="60" height="60">`;
  }

  extractLargeImageFromContent(content: string): void {
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
          this.commentData.comment = `<div>${content.replace(copyImage, '').replace(/\<br\>/ig, '').replace(new RegExp(copyImageTag, 'g'), '')}</div>`;
          // this.commentData.comment = content.replace(copyImage, '');
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
            this.commentData['file'] = file;
          } catch (error) {
            console.error('Base64 decoding error:', error);
          }
        } else {
          this.commentData.comment = content;
        }
      } else {
        this.commentData.comment = content;
      }
    } else {
      this.commentData.comment = content;
    }
  }
}