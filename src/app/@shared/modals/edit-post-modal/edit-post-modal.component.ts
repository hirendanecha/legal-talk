import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { getTagUsersFromAnchorTags } from '../../utils/utils';

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: './edit-post-modal.component.html',
  styleUrls: ['./edit-post-modal.component.scss'],
})
export class EditPostModalComponent implements AfterViewInit {
  @Input() cancelButtonLabel: string = 'Cancel';
  @Input() confirmButtonLabel: string = 'Confirm';
  @Input() title: string = 'Confirmation Dialog';
  @Input() message: string;
  @Input() data: any;
  @ViewChild('parentPostCommentElement', { static: false }) parentPostCommentElement: ElementRef;

  postData: any = {
    file: null,
    url: '',
    tags: []
  };

  postInputValue: string = ''
  commentMessageTags: any[];
  selectedImage = ''
  pdfName = ''

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
      console.log(this.data)
      this.postInputValue = this.data?.postdescription
      this.pdfName = this.data?.pdfUrl?.split('/')[3];
      // this.postData.id = this.data.id
      // this.postData.postId = this.data.postId
      // this.postData.profileId = this.data.profileId
      // this.postData.imageUrl = this.data?.imageUrl
      this.postData = { ...this.data }
      this.changeDetectorRef.detectChanges();
    }
  }

  onPostFileSelect(event: any): void {
    const file = event.target?.files?.[0] || {};
    if (file.type.includes('image/')) {
      this.postData['file'] = file;
      this.selectedImage = URL.createObjectURL(file);
    } else if (file.type.includes('application/pdf')) {
      this.postData['file'] = file;
      this.pdfName = file?.name;
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
    this.postData['file'] = null;
    this.postData['imageUrl'] = '';
    this.postData['pdfUrl'] = '';
    this.selectedImage = '';
    this.pdfName = '';
  }

  onChangeComment(): void {
    this.postData.tags = getTagUsersFromAnchorTags(this.commentMessageTags);
    console.log(this.postData.tags)
    this.activeModal.close(this.postData);
  }

  onTagUserInputChangeEvent(data: any): void {
    // console.log('comments-data', data)
    // this.postData.comment = data?.html;
    this.extractLargeImageFromContent(data.html)
    this.commentMessageTags = data?.tags;
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
          // this.postData.comment = content.replace(copyImage, '');
          let copyImageTag = '<img\\s*src\\s*=\\s*""\\s*alt\\s*="">'
          this.postData.postdescription = `<div>${content.replace(copyImage, '').replace(/\<br\>/ig, '').replace(new RegExp(copyImageTag, 'g'), '')}</div>`;
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
            this.postData['file'] = file;
          } catch (error) {
            console.error('Base64 decoding error:', error);
          }
        } else {
          this.postData.postdescription = content;
        }
      } else {
        this.postData.postdescription = content;
      }
    } else {
      this.postData.postdescription = content;
    }
  }
}
