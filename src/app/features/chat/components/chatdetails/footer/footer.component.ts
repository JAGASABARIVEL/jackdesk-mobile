import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { EventsAndAlertsService } from 'src/app/shared/services/events-and-alerts.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage.services';

@Component({
  selector: 'app-chatdetails-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule], // Required here
})
export class FooterComponent implements OnInit {

  private destroy$ = new Subject<void>();
  @Input() conversationId: number = -1;
  @Input() chatDetail !: any;

  constructor(private localStorage: LocalStorageService, private chatService: ChatService, private eventAndAlerts: EventsAndAlertsService) { }

  ngOnInit() { }

  message: string = '';
  caption: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  addNewMessage(): void {
    // Prevent empty sends
    if (!this.message.trim() && !this.selectedFile) {
      return;
    }

    // Prepare response payload
    const response: any = {
      conversation_id: this.chatDetail.id,
      user_id: this.localStorage.profile.user.id,
      file: null
    };

    if (this.selectedFile) {
      // Media message with optional caption
      response.message_type = "media" //this.selectedFile.type
      response.message_body = this.caption?.trim() || '';
      response.file = this.selectedFile;

      // Local preview message
      this.chatDetail.messages.push({
        message_body: response.message_body,
        message_type: response.message_type,
        media_url: this.previewUrl,
        sender: this.localStorage.profile.user.id,
        sent_time: new Date(),
        status: 'uploading',
        type: 'org'
      });
    } else {
      // Pure text message
      response.message_type = 'text';
      response.message_body = this.message.trim();

      this.chatDetail.messages.push({
        message_body: response.message_body,
        message_type: response.message_type,
        sender: this.localStorage.profile.user.id,
        sent_time: new Date(),
        status: 'unknown',
        type: 'org'
      });
    }

    

    // Send to backend
    this.chatService.respond_to_message(response.conversation_id, response).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.clearAttachment();
        this.eventAndAlerts.updateRespondToMessageEvent(true);
      },
      error: (err) => {
        console.error("Message failed", err);
        this.clearAttachment();
        this.eventAndAlerts.updateRespondToMessageEvent(false);
      }
    });
  }

  onFileSelected(event: any) {
  const input = event.target as HTMLInputElement;
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
    // 🧹 Reset file input to allow re-selection of same file
    input.value = '';
  }
}

  clearAttachment(): void {
    this.chatDetail.status = 'active';
    this.message = '';
    this.selectedFile = null;
    this.previewUrl = null;
    this.caption = '';
  }

  get isImage() {
  return this.selectedFile?.type.startsWith('image');
}

get isVideo() {
  return this.selectedFile?.type.startsWith('video');
}

ngOnDestroy() {
    this.destroy$.next();      // 🛑 Triggers teardown of subscriptions in *this component*
    this.destroy$.complete();
  }

}
