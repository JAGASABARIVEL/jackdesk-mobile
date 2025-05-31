import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { ChatService } from "../services/chat.service";

@Injectable({ providedIn: 'root' })
export class ChatResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const userId = Number(route.paramMap.get('id'));
    return this.loadChatDetails(userId);
  }

  constructor(private chatService: ChatService) {}

  loadChatDetails(uid: number): Observable<any> {
    return this.chatService.list_conversation_from_id(uid);
  }
}
