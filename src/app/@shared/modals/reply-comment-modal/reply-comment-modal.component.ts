import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { getTagUsersFromAnchorTags } from '../../utils/utils';

@Component({
  selector: 'app-reply-comment-modal',
  templateUrl: './reply-comment-modal.component.html',
  styleUrls: ['./reply-comment-modal.component.scss'],
})
export class ReplyCommentModalComponent implements AfterViewInit {
  @Input() cancelButtonLabel: string = 'Cancel';
  @Input() confirmButtonLabel: string = 'Confirm';
  @Input() title: string = 'Confirmation Dialog';
  @Input() message: string;
  @Input() data: any;
  @ViewChild('parentPostCommentElement', { static: false }) parentPostCommentElement: ElementRef;

  commentData: any = {
    file: null,
    url: '',
    tags: [],
    meta: {},
  };

  commentMessageInputValue: string = ''
  commentMessageTags: any[];
  selectedImage = ''

  constructor(public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }
  
  ngAfterViewInit(): void {
    if (this.data) {

      // this.renderer.setProperty(
      //   this.parentPostCommentElement?.nativeElement,
      //   'innerHTML',
      //   this.data.comment
      // );
      this.commentMessageInputValue = this.data?.comment
      this.commentData.id = this.data.id
      this.commentData.parentCommentId = this.data.parentCommentId
      this.commentData.postId = this.data.postId
      this.commentData.profileId = this.data.profileId
      this.commentData.imageUrl = this.data?.imageUrl
      this.changeDetectorRef.detectChanges();
    }
  }

  onPostFileSelect(event: any): void {
    const file = event.target?.files?.[0] || {};
    if (file.type.includes('image/')) {
      this.commentData['file'] = file;
      this.selectedImage = URL.createObjectURL(file);
    }
    else {
      this.toastService.danger(`sorry ${file.type} are not allowed!`)
    }
    // if (file?.size < 5120000) {
    // } else {
    //   this.toastService.warring('Image is too large!');
    // }
  }

  removePostSelectedFile(): void {
    this.commentData['file'] = null;
    this.commentData['imageUrl'] = '';
    this.selectedImage = '';
  }

  onChangeComment(): void {
    this.commentData.tags = getTagUsersFromAnchorTags(this.commentMessageTags);
    this.activeModal.close(this.commentData);
  }

  onTagUserInputChangeEvent(data: any): void {
    this.extractLargeImageFromContent(data.html)
    this.commentMessageTags = data?.tags;
    this.commentData.meta = data?.meta;
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
          // this.commentData.comment = content.replace(copyImage, '');
          let copyImageTag = '<img\\s*src\\s*=\\s*""\\s*alt\\s*="">'
          this.commentData.comment = `<div>${content.replace(copyImage, '').replace(/\<br\>/ig, '').replace(new RegExp(copyImageTag, 'g'), '')}</div>`;
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
