import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})
export class PdfPreviewComponent {

  @Input('src') src: string;
  @Input('classes') classes: string = 'w-40-px h-40-px';

  previewSrc: string = '';

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  openImagePreview(src: string) {
    this.previewSrc = src;
    this.renderer.setStyle(this.el.nativeElement.ownerDocument.body, 'overflow', 'hidden');
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeImagePreview() {
    this.previewSrc = '';
    this.renderer.removeStyle(this.el.nativeElement.ownerDocument.body, 'overflow');
  }
}
