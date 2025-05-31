import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HOST } from '../../../environments/environment'
import { LocalStorageService } from './localstorage.services';

@Injectable({
  providedIn: 'root',
})
export class PlatformManagerService {
  list_platforms_url = `${HOST}/platforms/`;
  templates_uri = "/templates"

  profile !: any;
  auth_token !: any;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
      this.profile = localStorage.profile;
    if (this.profile) {
      this.auth_token = this.profile["access"]
    }
  }

  get_templates(platformId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.list_platforms_url}${platformId}${this.templates_uri}`, { headers });
  }

  list_platforms(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(this.list_platforms_url, { headers });
  }

  create_platform(payload: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.post(this.list_platforms_url, payload=payload, { headers })
  }

  update_platform(platform_id: number, payload: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.put(`${this.list_platforms_url}${platform_id}`, payload=payload, { headers })
  }
}
