import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeeFirstUserService {
  selectedFile: any;
  postData: any = {};
  private baseUrl = environment.serverUrl + 'see-first-user';
  constructor(private http: HttpClient) {}

  create(data: any): Observable<Object> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  remove(id: number, seeFirstProfileId = null): Observable<Object> {
    return this.http.delete(
      `${this.baseUrl}/remove/${id}${
        seeFirstProfileId ? '/' + seeFirstProfileId : ''
      }`
    );
  }

  getByProfileId(profileId: number) {
    return this.http.get(`${this.baseUrl}/getByProfileId/${profileId}&q=${Date.now()}`);
  }

  getSeeFirstIdByProfileId(profileId: number) {
    return this.http.get(
      `${this.baseUrl}/getSeeFirstIdByProfileId/${profileId}&q=${Date.now()}`
    );
  }
}
