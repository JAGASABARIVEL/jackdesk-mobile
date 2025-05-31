
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HOST } from '../../../environments/environment'
import { LocalStorageService } from './localstorage.services';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  conversations_url = `${HOST}/conversations/`;
  new_conversation_uri = "?status=new"
  active_conversation_uri = "?status=active"
  active_conversation_for_user_uri = "active_conversation_for_user/"
  all_conversation_for_user_uri = "all_conversation_for_user"
  history_by_contact_uri = "history_by_contact"
  active_conversation_for_org_uri = "active_conversation_for_org/"

  assign_conversation_uri = "/assign_conversation/"
  close_conversation_uri = "/close_conversation/"
  respond_to_message_uri = "/respond_to_message/"
  start_new_conversation_uri = "new_conversation/"
  notification_uri = "notification"

  profile;
  auth_token;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
      this.profile = localStorage.profile;
    if (this.profile) {
      this.auth_token = this.profile["access"]
    }
    else {
      console.error("Profile is empty - chat service");
    }
  }

  list_notification() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${this.notification_uri}`, { headers });
  }

  list_all_conversations(is_user_specific=false): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}?is_user_specific=${is_user_specific}`, { headers });
  }

  list_conversation_from_id(conversationId: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${conversationId}/`, { headers });
  }

  list_new_conversations(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${this.new_conversation_uri}`, { headers });
  }

  list_active_conversations(is_user_specific=false): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${this.active_conversation_uri}&is_user_specific=${is_user_specific}`, { headers });
  }

  list_new_active_conversations(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${this.active_conversation_for_org_uri}`, { headers });
  }

  list_active_coversations_for_user(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${this.active_conversation_for_user_uri}`, { headers });
  }

  list_all_coversations_for_user(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${this.all_conversation_for_user_uri}`, { headers });
  }

  list_historical_conversations_for_contact(contactId: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${this.history_by_contact_uri}?contact_id=${contactId}`, { headers });
  }

  assign_conversation(conversationId: any, assigneeId: any): Observable<any> {
    let payload = {"id": assigneeId}
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.post(`${this.conversations_url}${conversationId}${this.assign_conversation_uri}`, payload=payload, { headers });
  }

  close_conversation(conversationId: any, payload: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.post(`${this.conversations_url}${conversationId}${this.close_conversation_uri}`, payload=payload, { headers });
  }

  respond_to_message(conversationId: number, payload: any): Observable<any> {
    const url = `${this.conversations_url}${conversationId}${this.respond_to_message_uri}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
  
    if (payload.message_type === 'media') {
      const formData = new FormData();
      formData.append('message_body', payload.message_body);
      formData.append('message_type', payload.message_type);
      formData.append('file', payload.file);
  
      // Don't manually set Content-Type for FormData; let the browser handle it
      return this.http.post(url, formData, { headers });
    } else {
      // For JSON requests, add appropriate content type
      const jsonHeaders = headers.set('Content-Type', 'application/json');
      return this.http.post(url, payload=payload, { headers: jsonHeaders });
    }
  }

  start_new_conversation(payload: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.post(`${this.conversations_url}${this.start_new_conversation_uri}`, payload=payload, { headers });
  }

  getChatDetailFromId(id: number) {
    return {
      "id": 14,
        "contact": {
        "id": 5,
          "name": "Jagasabarivel (Customer)",
            "phone": "918870092425",
              "image": null,
                "platform_name": "whatsapp"
      },
      "assigned": {
        "id": 23,
          "name": "jagasabarivel k"
      },
      "organization": 5,
        "status": "closed",
          "created_at": "2025-05-16T07:50:04.437002Z",
            "updated_at": "2025-05-22T13:26:56.399152Z",
              "open_by": "jagasabarivel k",
                "closed_by": 23,
                  "closed_reason": "",
                    "messages": [
                      {
                        "id": 26,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "{}",
                        "status": "delivered",
                        "status_details": null,
                        "sent_time": "2025-05-16T07:50:05.982137Z",
                        "sender": 23,
                        "template": "{\"name\": \"hello_world\", \"parameter_format\": \"POSITIONAL\", \"components\": [{\"type\": \"HEADER\", \"format\": \"TEXT\", \"text\": \"Hello World\"}, {\"type\": \"BODY\", \"text\": \"Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us.\"}, {\"type\": \"FOOTER\", \"text\": \"WhatsApp Business Platform sample message\"}], \"language\": \"en_US\", \"status\": \"APPROVED\", \"category\": \"UTILITY\", \"id\": \"1079128677282640\"}",
                        "media_url": null
                      },
                      {
                        "id": 27,
                        "type": "org",
                        "message_type": "application/pdf",
                        "message_body": "Sample GST",
                        "status": "delivered",
                        "status_details": "171",
                        "sent_time": "2025-05-16T07:50:59.930074Z",
                        "sender": 23,
                        "template": null,
                        "media_url": "https://s3.us-east-005.backblazeb2.com/solvedesktop-storage/kjagasabarivel/JackDesk/customer/sent/918870092425/2025-05-16/GST.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=005ed47f9b439120000000002%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T065312Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=f077a70aa9376a130a59800660b4623344c7551ef6d20652e69a73b4540154b4"
                      },
                      {
                        "id": 27,
                        "type": "customer",
                        "message_type": "image/jpeg",
                        "message_body": "image_704243535894283",
                        "status": "responded",
                        "status_details": "175",
                        "received_time": "2025-05-16T07:52:23.849786Z",
                        "media_url": "https://s3.us-east-005.backblazeb2.com/solvedesktop-storage/kjagasabarivel/JackDesk/customer/received/918870092425/2025-05-16/image_704243535894283?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=005ed47f9b439120000000002%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T065312Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=b29bc21749f5393c413601a9c1e1005cfb5883723bfc0d87429aebaa01f74f57"
                      },
                      {
                        "id": 28,
                        "type": "org",
                        "message_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "message_body": "Sample Excel",
                        "status": "read",
                        "status_details": "176",
                        "sent_time": "2025-05-16T07:57:26.727300Z",
                        "sender": 23,
                        "template": null,
                        "media_url": "https://s3.us-east-005.backblazeb2.com/solvedesktop-storage/kjagasabarivel/JackDesk/customer/sent/918870092425/2025-05-16/sample_schedule.xlsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=005ed47f9b439120000000002%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T065312Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=498bb167482844fd5b2e16ccbb129089c200fd72906d3aada591330e9ad00383"
                      },
                      {
                        "id": 29,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Attached the excel for reference",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-16T07:58:04.864583Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 28,
                        "type": "customer",
                        "message_type": "application/pdf",
                        "message_body": "E-Invoice Dec.pdf",
                        "status": "responded",
                        "status_details": "177",
                        "received_time": "2025-05-16T08:03:56.004393Z",
                        "media_url": "https://s3.us-east-005.backblazeb2.com/solvedesktop-storage/kjagasabarivel/JackDesk/customer/received/918870092425/2025-05-16/E-Invoice%20Dec.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=005ed47f9b439120000000002%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T065312Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=0e1a493316c4bac80e3802842aaa67616b43bf0f299bbf5b711cd93e1a3dd5e0"
                      },
                      {
                        "id": 29,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Any file recieved?",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-16T08:04:33.727888Z",
                        "media_url": null
                      },
                      {
                        "id": 30,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "No Sir",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-16T08:04:45.912013Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 31,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Checking scroll",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-16T08:32:39.067499Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 30,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Hi Sir",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-16T09:58:17.822589Z",
                        "media_url": null
                      },
                      {
                        "id": 39,
                        "type": "org",
                        "message_type": "image/png",
                        "message_body": "",
                        "status": "read",
                        "status_details": "190",
                        "sent_time": "2025-05-17T03:50:43.692355Z",
                        "sender": 23,
                        "template": null,
                        "media_url": "https://s3.us-east-005.backblazeb2.com/solvedesktop-storage/kjagasabarivel/JackDesk/customer/sent/918870092425/2025-05-17/attendance_failed.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=005ed47f9b439120000000002%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T065312Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=b5b809e90a83724067c3caa033fef8caf196cf0a21700874ab418bff90f9d988"
                      },
                      {
                        "id": 40,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Hi Sir",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-17T03:51:00.009152Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 41,
                        "type": "org",
                        "message_type": "image/png",
                        "message_body": "",
                        "status": "read",
                        "status_details": "191",
                        "sent_time": "2025-05-17T03:55:04.655022Z",
                        "sender": 23,
                        "template": null,
                        "media_url": "https://s3.us-east-005.backblazeb2.com/solvedesktop-storage/kjagasabarivel/JackDesk/customer/sent/918870092425/2025-05-17/attendance_failed.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=005ed47f9b439120000000002%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T065312Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=b5b809e90a83724067c3caa033fef8caf196cf0a21700874ab418bff90f9d988"
                      },
                      {
                        "id": 42,
                        "type": "org",
                        "message_type": "image/png",
                        "message_body": "",
                        "status": "read",
                        "status_details": "192",
                        "sent_time": "2025-05-17T03:57:42.400344Z",
                        "sender": 23,
                        "template": null,
                        "media_url": "https://s3.us-east-005.backblazeb2.com/solvedesktop-storage/kjagasabarivel/JackDesk/customer/sent/918870092425/2025-05-17/login_success.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=005ed47f9b439120000000002%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T065313Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=9c590b82a8adc144881f954eddf3a3813d369c10636eebe42872dd797fc51d0b"
                      },
                      {
                        "id": 31,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Hi Sir",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T05:38:08.082201Z",
                        "media_url": null
                      },
                      {
                        "id": 32,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Testing redirect",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T05:40:55.031893Z",
                        "media_url": null
                      },
                      {
                        "id": 33,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Any",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T05:41:27.564846Z",
                        "media_url": null
                      },
                      {
                        "id": 34,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Again",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T05:41:48.100429Z",
                        "media_url": null
                      },
                      {
                        "id": 43,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Okay Sir",
                        "status": "failed",
                        "status_details": "Whatsapp error - failed to send message: Error validating access token: Session has expired on Friday, 16-May-25 22:00:00 PDT. The current time is Friday, 16-May-25 22:42:04 PDT.",
                        "sent_time": "2025-05-17T05:42:05.051402Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 35,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Redirrct",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T05:43:56.718832Z",
                        "media_url": null
                      },
                      {
                        "id": 36,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Any update",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T05:45:41.681436Z",
                        "media_url": null
                      },
                      {
                        "id": 44,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "thats cool",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-17T05:46:04.170305Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 45,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Check again",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-17T05:47:01.639960Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 46,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Now",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-17T05:49:08.726387Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 47,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Scroll check",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-17T05:53:03.615866Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 37,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Hi",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T07:12:08.782011Z",
                        "media_url": null
                      },
                      {
                        "id": 38,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Hi",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T07:13:17.917121Z",
                        "media_url": null
                      },
                      {
                        "id": 53,
                        "type": "org",
                        "message_type": "image/png",
                        "message_body": "Company screenshot",
                        "status": "failed",
                        "status_details": "Failed to send message: 401 Client Error: Unauthorized for url: https://graph.facebook.com/v21.0/469812416223656/media",
                        "sent_time": "2025-05-17T08:21:32.813488Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 54,
                        "type": "org",
                        "message_type": "image/png",
                        "message_body": "Company",
                        "status": "failed",
                        "status_details": "Failed to send message: 400 Client Error: Bad Request for url: https://graph.facebook.com/v21.0/469812416223656/media",
                        "sent_time": "2025-05-17T08:22:52.070490Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 55,
                        "type": "org",
                        "message_type": "image/png",
                        "message_body": "new company",
                        "status": "failed",
                        "status_details": "Failed to send message: 400 Client Error: Bad Request for url: https://graph.facebook.com/v21.0/469812416223656/media",
                        "sent_time": "2025-05-17T08:28:10.684860Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 58,
                        "type": "org",
                        "message_type": "image/png",
                        "message_body": "",
                        "status": "failed",
                        "status_details": "Failed to send message: 400 Client Error: Bad Request for url: https://graph.facebook.com/v21.0/469812416223656/media",
                        "sent_time": "2025-05-17T08:45:47.682733Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 59,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Hi",
                        "status": "failed",
                        "status_details": "Whatsapp error - failed to send message: Unsupported post request. Object with ID '469812416223656' does not exist, cannot be loaded due to missing permissions, or does not support this operation. Please read the Graph API documentation at https://developers.facebook.com/docs/graph-api",
                        "sent_time": "2025-05-17T08:48:16.421420Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 60,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Hi",
                        "status": "failed",
                        "status_details": "Whatsapp error - failed to send message: Unsupported post request. Object with ID '469812416223656' does not exist, cannot be loaded due to missing permissions, or does not support this operation. Please read the Graph API documentation at https://developers.facebook.com/docs/graph-api",
                        "sent_time": "2025-05-17T08:52:05.939468Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 61,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Hi",
                        "status": "delivered",
                        "status_details": null,
                        "sent_time": "2025-05-17T08:54:25.783050Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 42,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Received",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T09:03:44.152606Z",
                        "media_url": null
                      },
                      {
                        "id": 49,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Received",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T09:15:34.269647Z",
                        "media_url": null
                      },
                      {
                        "id": 51,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Received on jackdesk",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T09:19:45.541040Z",
                        "media_url": null
                      },
                      {
                        "id": 54,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Received on jackdesk",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T09:36:30.314841Z",
                        "media_url": null
                      },
                      {
                        "id": 57,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Sabari from Muthu",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T09:41:34.586452Z",
                        "media_url": null
                      },
                      {
                        "id": 58,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Sorry sabari from jackdesk",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T09:41:37.101447Z",
                        "media_url": null
                      },
                      {
                        "id": 61,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Hopefully it's working",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-17T12:19:44.021141Z",
                        "media_url": null
                      },
                      {
                        "id": 63,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Did migration works on aws",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-20T00:19:04.305942Z",
                        "media_url": null
                      },
                      {
                        "id": 64,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Now",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-20T00:21:39.869202Z",
                        "media_url": null
                      },
                      {
                        "id": 68,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Yes it works perfect",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-20T00:21:53.568302Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 65,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Now",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-20T00:54:25.482141Z",
                        "media_url": null
                      },
                      {
                        "id": 66,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Now",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-20T00:56:14.050651Z",
                        "media_url": null
                      },
                      {
                        "id": 69,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Received",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-20T00:58:54.730050Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 70,
                        "type": "org",
                        "message_type": "image/png",
                        "message_body": "Image Graph",
                        "status": "sent",
                        "status_details": "203",
                        "sent_time": "2025-05-20T00:59:31.277704Z",
                        "sender": 23,
                        "template": null,
                        "media_url": "https://s3.us-east-005.backblazeb2.com/solvedesktop-storage/kjagasabarivel/JackDesk/customer/sent/918870092425/2025-05-20/Screenshot%202025-05-14%20193334.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=005ed47f9b439120000000002%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T065937Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=221a52b273bc07e0560ef1c0927587a10ad3608bc00a8246e785f8af3a7dab20"
                      },
                      {
                        "id": 71,
                        "type": "org",
                        "message_type": "text",
                        "message_body": "Sending from cloud",
                        "status": "read",
                        "status_details": null,
                        "sent_time": "2025-05-20T01:19:51.652655Z",
                        "sender": 23,
                        "template": null,
                        "media_url": null
                      },
                      {
                        "id": 68,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "New message",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-20T16:33:27.416265Z",
                        "media_url": null
                      },
                      {
                        "id": 69,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Again",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-20T16:33:42.044330Z",
                        "media_url": null
                      },
                      {
                        "id": 70,
                        "type": "customer",
                        "message_type": "text",
                        "message_body": "Hi Sir",
                        "status": "responded",
                        "status_details": null,
                        "received_time": "2025-05-21T12:03:22.316730Z",
                        "media_url": null
                      }
                    ]
    }
  }

  // +++++++++++++++ Metrics +++++++++++++++++
  stats_uri = 'stats';
  employee_metrics_uri = 'metrics/employee'
  org_metrics_uri = 'metrics/org'

  stats(period: any, startDate: any, endDate: any) {
    let params = new HttpParams().set('filter', period).set('start_date', startDate).set('end_date', endDate);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${this.stats_uri}`, { params, headers });
  }

  employee_metrics(period: any, startDate: any, endDate: any, userId: any=null) {
    let params = new HttpParams().set('period', period).set('start_date', startDate).set('end_date', endDate);
    if (userId !== null) {
      params = params.set('user_id', userId);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${this.employee_metrics_uri}`, { params, headers });
  }

  org_metrics(period: any, startDate: any, endDate: any) {
    let params = new HttpParams().set('period', period).set('start_date', startDate).set('end_date', endDate);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`);
    return this.http.get(`${this.conversations_url}${this.org_metrics_uri}`, { params, headers });
  }

  // ++++++ Cost Report  ++
  usage_cost_uri = 'cost-report';
  usage_cost(from_date: any, to_date: any) {
    const headers = new HttpHeaders({'Authorization': `Bearer ${this.auth_token}`});
    const params = new HttpParams().set('from_date', from_date).set('to_date', to_date);
    return this.http.get(`${this.conversations_url}${this.usage_cost_uri}`, { headers, params });
  }
}

