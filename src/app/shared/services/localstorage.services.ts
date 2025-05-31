import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

    profile !: any;

    chatDetails = signal<Record<string, any>>({});

    setProfile(profile: any): boolean {
      this.profile = profile;
      return true;
    }
  
    /** 
     * {
     *     convid: {chatdetail},
     *     convid: {chatdetail},
     * }
    */
    

initChatDetails(chatDetail: any) {
  this.chatDetails.update((data) => ({
    ...data,
    [chatDetail.id]: chatDetail
  }));
}

}
