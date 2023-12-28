import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from 'src/app/@shared/services/toast.service';

@Component({
  selector: 'app-img-picker',
  templateUrl: './img-picker.component.html',
  styleUrls: ['./img-picker.component.scss']
})
export class ImgPickerComponent {

  @Input('url') url: string = '';
  @Input('defaultImg') defaultImg: string = '/assets/images/avtar/placeholder-user.png';
  @Input('classes') classes: string = 'w-156-px h-156-px';
  @Output('onFileChange') onFileChange: EventEmitter<any> = new EventEmitter<any>();

  fileData: any = {
    file: null,
    url: ''
  };

  constructor(
    private toastService: ToastService
  ) {}

  onImgFileChange(event: any): void {
    const file = event.target?.files?.[0] || {};
    // if (file.size / (1024 * 1024) > 5) {
    //   this.toastService.danger('Image file size exceeds 5 MB!');
    //   return;
    // }
    if (file) {
      this.fileData['file'] = file;
      this.fileData['url'] = URL.createObjectURL(file);

      this.onFileChange?.emit(this.fileData);
    }
  //   if (file?.size < 5120000) {
  // }
  //   else {
  //     this.toastService.warring('Image is too large!');
  //   }
  }

  onClearFile(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    this.fileData = {
      file: null,
      url: ''
    };

    this.onFileChange?.emit(this.fileData);
  }
}
