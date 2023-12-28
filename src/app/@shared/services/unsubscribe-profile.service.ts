import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnsubscribeProfileService {
  selectedFile: any;
  postData: any = {};
  private baseUrl = environment.serverUrl + 'unsubscribe-profile';
  constructor(private http: HttpClient) {}

  create(data: any): Observable<Object> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  remove(id: number): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/remove/${id}?q=${Date.now()}`)
  }

  getByProfileId(profileId: number): Observable<Object> {
    return this.http.get(`${this.baseUrl}/getByProfileId/${profileId}?q=${Date.now()}`);
  }
}
