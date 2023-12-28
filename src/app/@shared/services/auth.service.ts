import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login } from '../constant/login';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  login(login: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, login);
  }

  forgotPassword(data: Object): Observable<Object> {
    return this.http.post(
      `${environment.serverUrl}customers/forgot-password`,
      data
    );
  }

  setPassword(data: Object): any {
    return this.http.post(
      `${environment.serverUrl}customers/set-password`,
      data
    );
  }

  userVerificationResend(data: any) {
    return this.http.post(
      `${environment.serverUrl}customers/user/verification/resend`,
      data
    );
  }

  customerlogin(login: Login): Observable<Object> {
    return this.http.post(
      this.baseUrl + 'login',
      {
        email: login.Email,
        password: login.Password,
      },
      httpOptions
    );
  }
}
