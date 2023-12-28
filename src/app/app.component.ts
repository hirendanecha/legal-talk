import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { SharedService } from './@shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { SocketService } from './@shared/services/socket.service';
import { CustomerService } from './@shared/services/customer.service';
import { Howl } from 'howler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'healing-tube';
  showButton = false;
  tab: any;

  profileId = '';
  notificationId: number;
  originalFavicon: HTMLLinkElement;
  notificationSoundOct = ''

  constructor(
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private socketService: SocketService,
    private customerService: CustomerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkDocumentFocus()
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.profileId = localStorage.getItem('profileId');
      this.originalFavicon = document.querySelector('link[rel="icon"]');
      this.sharedService.getUserDetails();
    }
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
    setTimeout(() => {
      const splashScreenLoader = document.getElementById('splashScreenLoader');
      if (splashScreenLoader) {
        splashScreenLoader.style.display = 'none';
      }
    }, 1000);

    if (!this.socketService.socket?.connected) {
      this.socketService.socket?.connect();
    }

    this.socketService.socket?.emit('join', { room: this.profileId });
    this.socketService.socket?.on('notification', (data: any) => {
      if (data) {
        console.log('new-notification', data)
        this.notificationId = data.id;
        this.sharedService.isNotify = true;
        this.originalFavicon.href = '/assets/images/icon-unread.jpg';
        if (data?.actionType === 'T') {
          var sound = new Howl({
            src: ['https://s3.us-east-1.wasabisys.com/freedom-social/freedom-notification.mp3']
          });
          this.notificationSoundOct = localStorage?.getItem('notificationSoundEnabled');
          if (this.notificationSoundOct !== 'N') {
            if (sound) {
              sound?.play();
            }
          }
        }
        if (this.notificationId) {
          this.customerService.getNotification(this.notificationId).subscribe({
            next: (res) => {
              localStorage.setItem('isRead', res.data[0]?.isRead);
            },
            error: (error) => {
              console.log(error);
            },
          });
        }
      }
    });
    const isRead = localStorage.getItem('isRead');
    if (isRead === 'N') {
      this.sharedService.isNotify = true;
    }
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 300) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  @HostListener('document:visibilitychange', ['$event']) checkDocumentFocus() {
    if (!window.document.hidden) {
      if (this.tab) {
        clearInterval(this.tab);  
      }
      if (!this.socketService.socket?.connected) {
        this.socketService.socket?.connect();
        const profileId = +localStorage.getItem('profileId');
        this.socketService.socket?.emit('join', { room: profileId });
      }
    } else {
      this.tab = setInterval(() => {
        if (!this.socketService.socket?.connected) {
          this.socketService.socket?.connect();
          const profileId = +localStorage.getItem('profileId');
          this.socketService.socket?.emit('join', { room: profileId });
        }
      }, 3000)

    }
  }
}
