import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const authToken = localStorage.getItem('auth-token');
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next.handle(authRequest);
  }
}
