import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { HomeComponent } from './home.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { AuthenticationGuard } from 'src/app/@shared/guards/authentication.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  // {
  //   path: 'communities/:name',
  //   component: HomeComponent,
  //   canActivate: mapToCanActivate([AuthenticationGuard]),
   
  // },
  {
    path: 'pages/:name',
    component: HomeComponent,
    canActivate: mapToCanActivate([AuthenticationGuard]),
  },
  {
    path: 'post/:id',
    component: PostDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
