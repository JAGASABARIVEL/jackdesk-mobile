import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalStorageService } from './shared/services/localstorage.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    if (!this.localStorageService.profile) {
      this.router.navigate(["login"]);
    }
  }
  
}
