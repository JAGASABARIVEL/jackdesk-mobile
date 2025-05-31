import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HOST } from '../../../environments/environment'
import { LocalStorageService } from './localstorage.services';

@Injectable({
  providedIn: 'root'
})
export class ContactManagerService {

  contacts_url = `${HOST}/contacts/`;
  bulkDeleteUri = "bulk-delete";
  bulkImportUri = "import"

  groups_url = `${HOST}/groups/`;
  

  profile;
  auth_token;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
      this.profile = localStorage.profile;
    if (this.profile) {
      this.auth_token = this.profile["access"]
    }
    else {
      console.error("Profile is empty - contact service");
    }
  }

  // +++++++++++++++++++++ Contact Service ++++++++++++++

  list_contact(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(this.contacts_url, { headers });
  }

  delete_contact(contactId: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.delete(`${this.contacts_url}${contactId}`, { headers });
  }

  delete_contacts(contactIds: any) {
    let payload = {"contact_ids": contactIds}
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.delete(`${this.contacts_url}${this.bulkDeleteUri}`, { headers, body: payload });
  }

  create_contact(payload: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.post(this.contacts_url, payload=payload, { headers });
  }

  update_contact(payload: any) {
    let contactId = payload["id"]
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.patch(`${this.contacts_url}${contactId}`, payload=payload, { headers })
  }

  import_contact(payload: FormData) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.post(`${this.contacts_url}${this.bulkImportUri}`, payload=payload, { headers });
  }


  // +++++++++++++++++ Groups Service +++++++++++++++++++

  list_groups() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(this.groups_url, { headers });
  }

  delete_group(groupId: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.delete(`${this.groups_url}${groupId}`, { headers });
  }

  delete_groups(groupIds: any) {
    let payload = {"group_ids": groupIds}
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.delete(`${this.groups_url}${this.bulkDeleteUri}`, { headers, body: payload });
  }

  create_group(payload: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.post(this.groups_url, payload=payload, { headers });
  }

  update_group(payload: any) {
    let groupId = payload["id"]
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.patch(`${this.groups_url}${groupId}`, payload=payload, { headers })
  }
}
