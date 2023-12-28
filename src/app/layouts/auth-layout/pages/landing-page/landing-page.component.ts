import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { TokenStorageService } from 'src/app/@shared/services/token-storage.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  mobileMenuToggle: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private el: ElementRef,
    private customerService: CustomerService,
    private tokenStorageService: TokenStorageService,
    private spinner: NgxSpinnerService
  ) {
    const path = this.route.snapshot.routeConfig.path;
    if (path === 'logout') {
      this.logout();
    } else if (this.tokenStorageService.getToken()) {
      this.router.navigate(['/home']);
    }
    console.log('Constructor');
  }

  openLoginPage(): void {
    console.log('Login Clicked!');
    
    this.closeMenu();
    this.router.navigate(['/login']);
  }
  openSignPage(): void {
    this.closeMenu();
    this.router.navigate(['/register']);
  }
  mobileMenu(): void {
    this.mobileMenuToggle = !this.mobileMenuToggle;
    this.renderer.setStyle(
      this.el.nativeElement.ownerDocument.body,
      'overflow',
      'hidden'
    );
  }
  closeMenu() {
    this.mobileMenuToggle = false;
    this.renderer.removeStyle(
      this.el.nativeElement.ownerDocument.body,
      'overflow'
    );
  }

  logout(): void {
    // this.isCollapsed = true;
    this.spinner.show();
    this.customerService.logout().subscribe({
      next: (res) => {
        this.spinner.hide();
        this.tokenStorageService.signOut();
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
    // this.toastService.success('Logout successfully');
    // this.isDomain = false;
  }
}
