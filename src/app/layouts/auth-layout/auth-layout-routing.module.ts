import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AuthLayoutComponent } from './auth-layout.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AuthenticationGuard } from 'src/app/@shared/guards/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: SignUpComponent,
      },
      {
        path: 'reset-password/user',
        component: ResetPasswordComponent,
      },
      {
        path: 'healing-registration',
        loadChildren: () => import('src/app/layouts/main-layout/pages/healing-practitioner-registration/healing-practitioner-registration.module').then((m) => m.HealingPractitionerRegistrationModule),
        data: {
          isShowLeftSideBar: false,
          isShowRightSideBar: false,
          isShowResearchLeftSideBar: false
        },
        // canActivate: mapToCanActivate([AuthenticationGuard]),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthLayoutRoutingModule { }
