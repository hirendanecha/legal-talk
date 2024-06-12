import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { AuthenticationGuard } from 'src/app/@shared/guards/authentication.guard';
import { AppointmentCallComponent } from 'src/app/@shared/modals/appointment-call/appointment-call.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
        data: {
          isShowLeftSideBar: true,
          isShowRightSideBar: true
        }
      },
      {
        path: 'lawyers',
        loadChildren: () => import('./pages/communities/communities.module').then((m) => m.CommunitiesModule),
        data: {
          isShowLeftSideBar: true
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'pages',
        loadChildren: () => import('./pages/freedom-page/freedom-page.module').then((m) => m.FreedomPageModule),
        data: {
          isShowLeftSideBar: true
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then((m) => m.SettingsModule),
        data: {
          isShowLeftSideBar: true
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./pages/notifications/notification.module').then((m) => m.NotificationsModule),
        data: {
          isShowLeftSideBar: true
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'research',
        loadChildren: () => import('./pages/research/research.module').then((m) => m.ResearchModule),
        data: {
          isShowLeftSideBar: true,
          isShowRightSideBar: true,
          isShowResearchLeftSideBar: true
        },
        // canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'request-video-call',
        loadChildren: () => import('src/app/layouts/main-layout/pages/healing-practitioner-registration/healing-practitioner-registration.module').then((m) => m.HealingPractitionerRegistrationModule),
        data: {
          isShowLeftSideBar: false,
          isShowRightSideBar: false,
          isShowResearchLeftSideBar: false,
        },
        canActivate: mapToCanActivate([AuthenticationGuard]),
      },
      {
        path: 'appointment-call/:callId',
        component: AppointmentCallComponent,
        data: {
          isShowLeftSideBar: false,
          isShowRightSideBar: false,
          isShowResearchLeftSideBar: false,
          isShowChatListSideBar: false,
          isShowChatModule: true
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainLayoutRoutingModule { }
