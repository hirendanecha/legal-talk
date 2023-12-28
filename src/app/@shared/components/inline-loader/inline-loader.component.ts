import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inline-loader',
  templateUrl: './inline-loader.component.html',
  styleUrls: ['./inline-loader.component.scss']
})
export class InlineLoaderComponent {

  @Input('classes') classes: string = '';
  @Input('spinnerClasses') spinnerClasses: string = '';
}
