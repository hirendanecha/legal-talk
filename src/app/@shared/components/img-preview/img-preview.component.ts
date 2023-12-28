import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-img-preview',
  templateUrl: './img-preview.component.html',
  styleUrls: ['./img-preview.component.scss'],
})
export class ImgPreviewComponent {
  @Input('src') src: string;
  @Input('classes') classes: string = 'w-40-px h-40-px';

  previewSrc: string = '';

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.subscribeToEscapeKey();
  }

  openImagePreview(src: string) {
    this.previewSrc = src;
    this.renderer.setStyle(
      this.el.nativeElement.ownerDocument.body,
      'overflow',
      'hidden'
    );
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeImagePreview() {
    this.previewSrc = '';
    this.renderer.removeStyle(
      this.el.nativeElement.ownerDocument.body,
      'overflow'
    );
  }

  subscribeToEscapeKey(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.closeImagePreview();
      }
    });
  }
}
