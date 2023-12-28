import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SeeFirstUserService } from 'src/app/@shared/services/see-first-user.service';
import { SeoService } from 'src/app/@shared/services/seo.service';
import { ToastService } from 'src/app/@shared/services/toast.service';

@Component({
  selector: 'app-see-first-user',
  templateUrl: './see-first-user.component.html',
  styleUrls: ['./see-first-user.component.scss'],
})
export class SeeFirstUserComponent implements OnInit {
  profiles: any[] = [];

  constructor(
    private seeFirstUserService: SeeFirstUserService,
    private toastService: ToastService,
    private seoService:SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const data = {
      title: 'HealingTube See First User',
      url: `${window.location.href}`,
      description: '',
    };
    this.seoService.updateSeoMetaData(data);
  }

  ngOnInit(): void {
    console.log(isPlatformBrowser(this.platformId))
    if (isPlatformBrowser(this.platformId)) {
      this.getSeeFirstUsers();
    }
  }

  getSeeFirstUsers(): void {
    const profileId = +localStorage.getItem('profileId');
    this.seeFirstUserService.getByProfileId(profileId).subscribe({
      next: (res: any) => {
        this.profiles = res?.length > 0 ? res : [];
      }, error: (error => {
        console.log(error);
      })
    });
  }

  removeSeeFirstUser(id: number): void {
    this.seeFirstUserService.remove(id).subscribe({
      next: (res: any) => {
        this.getSeeFirstUsers();
        this.toastService.success(res.message);
      },
    });
  }
}
