import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsAndAlertsService {

  private respondToMessageEvent = new BehaviorSubject<string>(''); // default empty
  respondToMessageEvent$ = this.respondToMessageEvent.asObservable();

  updateRespondToMessageEvent(event: any): void {
    this.respondToMessageEvent.next(event);
  }

  constructor() { }
}
