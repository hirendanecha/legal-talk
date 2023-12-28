import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Community } from '../constant/customer';

@Injectable({
  providedIn: 'root',
})
export class CommunityPostService {
  selectedFile: any;
  postData: any = {};
  private baseUrl = environment.serverUrl + 'community-post';

  constructor(private http: HttpClient) {}

  upload(file: File, id: any, defaultType: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('folder', defaultType);
    formData.append('file', file);
    formData.append('id', id);
    formData.append('default', defaultType);

    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}/upload-community-post`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  getPosts(page) {
    return this.http.get(`${this.baseUrl}/?page=${page}&size=15`);
  }

  getPostsByProfileId(id) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getPostImg(): Observable<any> {
    let id = localStorage.getItem('profileId');
    return this.http.get(`${this.baseUrl}/files/community-post/${id}`);
  }

  createPost(postData: any): Observable<Object> {
    return this.http.post(`${this.baseUrl}/create`, postData);
  }

  deletePost(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
