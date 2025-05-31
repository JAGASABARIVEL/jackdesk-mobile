import { CommonModule } from '@angular/common';
import { Component, input, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { EventsAndAlertsService } from 'src/app/shared/services/events-and-alerts.service';

@Component({
  selector: 'app-chatdetails-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class BodyComponent  implements OnInit {
  @Input() conversationId = -1;
  chatDetail = input<any>();

  statusTooltipOpen = false;
statusTooltipEvent: any = null;
statusTooltipText: string = '';

showStatusTooltip(event: Event, text: string) {
  this.statusTooltipEvent = event;
  this.statusTooltipText = text;
  this.statusTooltipOpen = true;
}

  
  

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {}


}
