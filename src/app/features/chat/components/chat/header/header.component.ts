import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EventsAndAlertsService } from 'src/app/shared/services/events-and-alerts.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule]
})
export class ChatHeaderComponent  implements OnInit {

  @Output() searchEvent: EventEmitter<string> = new EventEmitter();

  constructor(private searchService: EventsAndAlertsService) { }

  ngOnInit() {}

  

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.searchEvent.emit(query.trim());
  }  

}
