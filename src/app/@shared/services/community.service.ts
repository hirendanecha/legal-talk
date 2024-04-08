import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Community } from '../constant/customer';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private baseUrl = environment.serverUrl + 'community';

  constructor(private http: HttpClient) { }

  upload(file: File, id: any, defaultType: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('folder', defaultType);
    formData.append('file', file);
    formData.append('id', id);
    formData.append('default', defaultType);

    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}/upload-community`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  getLocalCommunities(id: number): Observable<Community> {
    return this.http.get<Community>(
      `${this.baseUrl}/get-communities-pages/${id}`
    );
  }
  getCommunity(id, pageType: string): Observable<Community> {
    return this.http.get<Community>(
      `${this.baseUrl}/?id=${id}&pageType=${pageType}&q=${Date.now()}`
    );
  }

  createCommunity(communityData): Observable<Community> {
    return this.http.post<Community>(`${this.baseUrl}/create`, communityData);
  }

  editCommunity(communityData, id): Observable<Community> {
    return this.http.put<Community>(
      `${this.baseUrl}/edit/${id}`,
      communityData
    );
  }

  joinCommunity(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/join-community`, data);
  }
  createCommunityAdmin(data): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/create-community-admin`, data);
  }

  getLogoImg(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/community-logo/${id}`);
  }

  getCoverImg(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/community-cover/${id}`);
  }

  changeAccountType(id): Observable<any> {
    const type = 'communityAdmin';
    return this.http.get(
      `${this.baseUrl}/change-user-type/${id}/?type=${type}`
    );
  }

  getCommunityByUserId(id, pageType: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/user/${id}?pageType=${pageType}&q=${Date.now()}`
    );
  }

  getJoinedCommunityByProfileId(id, pageType: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl
      }/joined-community/${id}?pageType=${pageType}&q=${Date.now()}`
    );
  }

  getCommunityById(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getCommunityBySlug(slug: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/bySlug/${slug}?q=${Date.now()}`);
  }

  deleteCommunity(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  removeFromCommunity(id, profileId): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/leave?communityId=${id}&profileId=${profileId}`
    );
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-emphasis-and-area`);
  }
  
  getAllCommunities(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-communities`, data)
  }

  createAdvertizeMentLink(data): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-advertizement-link`, data);
  }

  editAdvertizeMentLink(data): Observable<any> {
    return this.http.post(`${this.baseUrl}/edit-advertizement-link`, data);
  }

  getLinkById(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-link/${id}`);
  }
}
