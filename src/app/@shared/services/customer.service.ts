import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../constant/customer';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
};
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = environment.serverUrl + 'customers';

  customerObs: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) { }

  getCustomer(id: number): Observable<any> {
    this.http
    .get<any>(`${this.baseUrl}/${id}`)
    .pipe(take(1))
    .subscribe((customers) => {
      const cust = customers?.[0];
      this.customerObs.next(cust);
    });

    return this.customerObs;
  }

  createCustomer(customer: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/register`, customer);
  }

  updateCustomer(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteCustomer(id: number, profileId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}?profileId=${profileId}`, { responseType: 'text' });
  }

  getCustomersList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all-customers`);
  }

  getCustomers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getZipData(zip: string, country: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/zip/${zip}?country=${country}`);
  }

  getStateData(country: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/states?countryCode=${country}`);
  }

  getCountriesData(): Observable<{ country_code: string; country: string }[]> {
    return this.http.get<{ country_code: string; country: string }[]>(
      `${this.baseUrl}/countries`
    );
  }

  createProfile(data: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/profile`, data);
  }

  getProfile(id): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/profile/${id}`);
  }

  updateProfile(id, customer: Customer): Observable<Object> {
    const token = localStorage.getItem("auth-token");
    return this.http.put(`${this.baseUrl}/profile/${id}`, customer, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
  }

  getProfileList(searchText): Observable<object> {
    return this.http.get(
      `${this.baseUrl}/search-user?searchText=${searchText}`
    );
  }

  getNotificationList(id: number, data = {}): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/get-notification/${id}?q=${Date.now()}`,
      data
    );
  }

  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notification/${id}`, {
      responseType: 'text',
    });
  }

  readUnreadNotification(id: number, isRead: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/edit-notification/${id}?isRead=${isRead}&q=${Date.now()}`
    );
  }

  logout(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/logout`,
      httpOptions
    );
  }

  getNotification(id): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/notification/${id}&q=${Date.now()}`,
    );
  }

  verifyToken(token): Observable<any> {
    return this.http.get(`${this.baseUrl}/verify-token/${token}`);
  }
}
