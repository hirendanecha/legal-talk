import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRewardDetailsService {

  private baseUrl = environment.serverUrl + 'user-reward-details';
  constructor(private http: HttpClient) {}

  getCountByProfileId(profileId: number): Observable<Object> {
    return this.http.get(`${this.baseUrl}/getCountByProfileId/${profileId}`);
  }
}
