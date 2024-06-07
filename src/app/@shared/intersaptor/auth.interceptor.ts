import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private route: ActivatedRoute) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let authToken = localStorage.getItem('auth-token');
    if (!authToken) {
      this.route.queryParams.subscribe((params) => {
        authToken = params['token'];
      });
    }
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next.handle(authRequest);
  }
}
