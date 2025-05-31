import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule ], // Required here
})
export class ChatListComponent  implements OnInit, AfterViewInit {

  @Input() chatItem: any = {}
  @Output() loaded: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.loaded.emit();
  }

  get total_unread_message_count() {
    let unread_msg_count = 0;
    for (let msg of this.chatItem.messages) {
      if (msg.status === 'unread') {
        unread_msg_count += 1;
      }
    }
    return unread_msg_count;
  }

  get last_message() {
    let last_msg = this.chatItem.messages[this.chatItem.messages.length - 1];
    return last_msg.message_body;
  }

  get last_message_time() {
    let last_msg = this.chatItem.messages[this.chatItem.messages.length - 1];
    let last_msg_time = last_msg?.type === 'customer' ? last_msg?.received_time : last_msg?.sent_time;
    return last_msg_time; 
  }

  get platformIconSrc() {
    let icon_src = ''
    switch (this.chatItem.contact.platform_name) {
      case 'whatsapp':
        icon_src = "assets/platform_icons/" + this.chatItem.contact.platform_name + '.svg'
        break;
      case 'messenger':
        icon_src = "assets/platform_icons/" + this.chatItem.contact.platform_name + '.png'
        break
      case 'webchat':
        icon_src = "assets/platform_icons/" + this.chatItem.contact.platform_name + '.png'
        break
    }
    return icon_src;
  }

}
