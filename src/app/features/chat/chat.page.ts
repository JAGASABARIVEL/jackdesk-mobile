import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonList, IonSegment, IonSegmentButton, IonBadge, IonSpinner } from '@ionic/angular/standalone';
import { ChatListComponent } from './components/chat/chat-list/chat-list.component';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Router, RouterLink } from '@angular/router';
import { ChatHeaderComponent } from './components/chat/header/header.component';
import { LocalStorageService } from 'src/app/shared/services/localstorage.services';
import { EventsAndAlertsService } from 'src/app/shared/services/events-and-alerts.service';
import { Subject, takeUntil } from 'rxjs';
import { SocketService } from 'src/app/shared/services/socketio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonList, IonSegment, IonSegmentButton, IonBadge, IonSpinner, CommonModule, FormsModule, RouterLink, ChatHeaderComponent, ChatListComponent]
})
export class ChatPage implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();



  fetchedNewChatListItems = signal<any[]>([]);
  filteredNewfetchedChatListItems = signal<any[]>([]);

  fetchedActiveChatListItems = signal<any[]>([]);
  filteredActivefetchedChatListItems = signal<any[]>([]);

  fetchedAllChatListItems = signal<any[]>([]);
  filteredAllfetchedChatListItems = signal<any[]>([]);

  chatTab: 'new' | 'active' | 'all' = 'active';  // Default selected tab

  detailsLoadedIntoCache = () => { return this.newDetailsLoadedIntoCache && this.activeDetailsLoadedIntoCache && this.allDetailsLoadedIntoCache }
  getFilteredChatItems(): any[] {

    if (this.chatTab === 'new') {
      return this.filteredNewfetchedChatListItems();  // implement this
    } else if (this.chatTab === 'active') {
      return this.filteredActivefetchedChatListItems();
    } else {
      return this.filteredAllfetchedChatListItems();  // all
    }
  }

  chatItemLoadCounter = 0;
allItemsReady = signal(false);

onChatItemLoaded() {
  this.chatItemLoadCounter++;  
  if (this.chatItemLoadCounter >= this.expectedLoadCount) {
    this.allItemsReady.set(true);
    this.cdr.detectChanges();
  }
}

expectedLoadCount = 0;
onTabChanged() {
  const currentItems = this.getFilteredChatItems();
  this.expectedLoadCount = currentItems.length;
  this.chatItemLoadCounter = 0;
  this.allItemsReady.set(false);
}


  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private eventAndAlerts: EventsAndAlertsService,
    private chatService: ChatService,
    private localStorage: LocalStorageService,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    if (!this.localStorage.profile) {
      this.router.navigate(["login"]);
    }
    else {
      this.loadActiveChats();  // active
      this.loadNewChats();     // new
      this.loadAllChats();
    }

    this.subscribeToWebSocketChatMessages();

    this.eventAndAlerts.respondToMessageEvent$.pipe(takeUntil(this.destroy$)).subscribe((data: any) => { this.loadNewChats(); this.loadActiveChats(); this.loadAllChats(); })
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onSearchEvent(term: string) {
    const lowerTerm = term.toLowerCase();

    const filterFn = (items: any[]) =>
      items.filter(item => item.contact.name.toLowerCase().includes(lowerTerm));

    if (this.chatTab === 'new') {
      this.filteredNewfetchedChatListItems.update(() =>
        filterFn(this.fetchedNewChatListItems())
      );
    } else if (this.chatTab === 'active') {
      this.filteredActivefetchedChatListItems.update(() =>
        filterFn(this.fetchedActiveChatListItems())
      );
    } else {
      this.filteredAllfetchedChatListItems.update(() =>
        filterFn(this.fetchedAllChatListItems())
      );
    }
  }


  loadNewChats() {
    this.chatService.list_new_conversations().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      let sortedData = this.sortUsersByLastMessageTime(data);
      this.fetchedNewChatListItems.update(() => sortedData);
      this.filteredNewfetchedChatListItems.update(() => sortedData)
      this.loadDetailsOfNewConversationIntoCache();
    });
  }

  loadActiveChats() {
    this.chatService.list_active_coversations_for_user().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      let sortedData = this.sortUsersByLastMessageTime(data);
      this.fetchedActiveChatListItems.update(() => sortedData);
      this.filteredActivefetchedChatListItems.update(() => sortedData)
      this.loadDetailsOfActiveConversationIntoCache();
    });
  }

  loadAllChats() {
    this.chatService.list_new_active_conversations().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      let sortedData = this.sortUsersByLastMessageTime(data);
      this.fetchedAllChatListItems.update(() => sortedData);
      this.filteredAllfetchedChatListItems.update(() => sortedData)
      this.loadDetailsOfAllConversationIntoCache();
    });
  }

  allDetailsLoadedIntoCache = false;
  loadDetailsOfAllConversationIntoCache() {
    let loadedCount = 0;
    for (let chatItem of this.fetchedAllChatListItems()) {
      this.localStorage.initChatDetails(chatItem); loadedCount += 1; this.allDetailsLoadedIntoCache = (loadedCount === this.fetchedAllChatListItems().length) ? true : false
    }
  }

  activeDetailsLoadedIntoCache = false;
  loadDetailsOfActiveConversationIntoCache() {
    let loadedCount = 0;
    for (let chatItem of this.fetchedActiveChatListItems()) {
      this.localStorage.initChatDetails(chatItem); loadedCount += 1; this.activeDetailsLoadedIntoCache = (loadedCount === this.fetchedActiveChatListItems().length) ? true : false
    }
  }

  newDetailsLoadedIntoCache = false;
  loadDetailsOfNewConversationIntoCache() {
    let loadedCount = 0;
    for (let chatItem of this.fetchedNewChatListItems()) {
      this.localStorage.initChatDetails(chatItem); loadedCount += 1; this.newDetailsLoadedIntoCache = (loadedCount === this.fetchedNewChatListItems().length) ? true : false
    }
  }

  loadNewConversations() {
    //this.chatService.list_new_conversations().subscribe((data) => { this.fetchedChatListItems = data; this.filteredfetchedChatListItems = data; this.sortUsersByLastMessageTime(data)});
  }

  sortUsersByLastMessageTime(data: []) {
    data.sort((a, b) => {
      const getLastMessageTime = (conversation: any): number => {
        if (!conversation.messages || conversation.messages.length === 0) return 0;

        const lastMessage = conversation.messages[conversation.messages.length - 1];

        const timeStr = lastMessage.received_time || lastMessage.sent_time;
        return timeStr ? new Date(timeStr).getTime() : 0;
      };

      return getLastMessageTime(b) - getLastMessageTime(a); // descending order
    });
    return data;

  }

  playNewConversationNotificationSound() {
    const audio = new Audio("../../../../assets/media/new_conversation_notofication.mp3");
    audio.play();
  }

  playNewMessageNotificationSound() {
    const audio = new Audio("../../../../assets/media/new_message.mp3");
    audio.play();
  }
  subscribeToWebSocketChatMessages(): void {
    this.socketService.getMessages().pipe(takeUntil(this.destroy$)).subscribe((message) => {
      this.loadActiveChats();
      //this.loadNewConversations();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();      // 🛑 Triggers teardown of subscriptions in *this component*
    this.destroy$.complete();
  }

}

