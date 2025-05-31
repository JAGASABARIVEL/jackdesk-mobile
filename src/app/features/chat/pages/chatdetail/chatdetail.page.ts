import { Component, OnInit, Output, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { TopbarComponent } from '../../components/chatdetails/topbar/topbar.component';
import { BodyComponent } from '../../components/chatdetails/body/body.component';
import { FooterComponent } from '../../components/chatdetails/footer/footer.component';
import { ChatService } from 'src/app/shared/services/chat.service';
import { SocketService } from 'src/app/shared/services/socketio.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage.services';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-chatdetail',
  templateUrl: './chatdetail.page.html',
  styleUrls: ['./chatdetail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BodyComponent, FooterComponent]
})
export class ChatdetailPage implements OnInit {

  private destroy$ = new Subject<void>();
  constructor(private route: ActivatedRoute, private chatService: ChatService, private socketService: SocketService, private localStorageService: LocalStorageService) { }
  conversationId = -1;
  userName: any;
  userAvatar: any;
  chatDetail = signal<any>({});

  ngOnInit() {
    // Extract resolved data
    //this.route.data.subscribe((data: any) => {
    //  this.chatDetail.update(() => data.chatData);
    //});

    // Extract query params (optional, not handled by resolver)
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.userName = params.get('username');
      this.userAvatar = params.get('userimage');
    });

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.conversationId = Number(params.get('id'));
      this.chatDetail.update(() => this.localStorageService.chatDetails()[this.conversationId])
    });

    this.subscribeToWebSocketChatMessages();
  }

  
  loadChatDetails(uid: number) {
      this.chatService.list_conversation_from_id(uid).pipe(takeUntil(this.destroy$)).subscribe((data)=> {
        this.chatDetail.update(() => data)
        this.localStorageService.initChatDetails(data);
      });
  }

  subscribeToWebSocketChatMessages(): void {
    this.socketService.getMessages().pipe(takeUntil(this.destroy$)).subscribe((message) => {
      this.loadChatDetails(this.conversationId);
      //this.loadNewConversations();
    });
  }


ngOnDestroy() {
    this.destroy$.next();      // 🛑 Triggers teardown of subscriptions in *this component*
    this.destroy$.complete();
  }
}