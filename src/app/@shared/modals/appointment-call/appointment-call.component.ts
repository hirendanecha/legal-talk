import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-appointment-call',
  templateUrl: './appointment-call.component.html',
  styleUrls: ['./appointment-call.component.scss'],
})
export class AppointmentCallComponent implements OnInit {
  appointmentCall: SafeResourceUrl;
  domain: string = 'facetime.tube';
  options: any;
  api: any;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) { }
  ngOnInit(): void {
    const appointmentURLCall = this.route.snapshot['_routerState'].url.split('/appointment-call/')[1];
    console.log(appointmentURLCall);
    this.appointmentCall = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://facetime.tube/' + appointmentURLCall
  );
    this.options = {
      roomName: appointmentURLCall,
      parentNode: document.querySelector('#meet'),
      configOverwrite: {
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        filmStripOnly: false,
        SHOW_JITSI_WATERMARK: false,
      },
      disableModeratorIndicator: true,
      lang: 'en',
    };

    const api = new JitsiMeetExternalAPI(this.domain, this.options);
    api.on('readyToClose', () => {
      this.router.navigate(['/home']).then(() => {
      });
    });
  }
}
