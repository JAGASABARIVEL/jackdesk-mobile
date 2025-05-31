import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { HOST, environment } from '../../../environments/environment';
import { LocalStorageService } from 'src/app/shared/services/localstorage.services';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular'
import { SocketService } from 'src/app/shared/services/socketio.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Subject, takeUntil } from 'rxjs';

declare var google: any;  // Add this at the top

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonButton, IonIcon, CommonModule, FormsModule]
})
export class LoginPage {
  private destroy$ = new Subject<void>();
  loggedIn: boolean = false;
  isNative = false;
  user!: SocialUser;

  constructor(private authService: SocialAuthService, private http: HttpClient, private router: Router, private localStorage: LocalStorageService, private socketService: SocketService) {
    if (isPlatform('capacitor')) {
      this.isNative = true;
      GoogleAuth.initialize(
        {
          clientId: environment.googleClientId,
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        }
      );
    }
    else {
      this.isNative = false;
      this.signInWeb();
    }
  }

  ngOnInit() {
    this.localStorage.profile = undefined;
  }

  signInWeb() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      if (user) {
        this.sendTokenToBackend(user.idToken)
      }
    });

    setTimeout(() => {  // Ensure Google is loaded before calling renderButton

      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.sendTokenToBackend(response.credential),
      });

      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    }, 1000);
  }

  signOut(): void {
    this.authService.signOut();
  }

  async signInNative() {
    const user = await GoogleAuth.signIn();
    console.log('🟢 Google User:', user);
    const token = user.authentication.idToken;
    console.log('🟢 ID Token:', token);
    this.sendTokenToBackend(token);
    // Send user.idToken to your backend to verify and log in
  }

  setupLogin(profile: any) {
    if (this.localStorage.setProfile(profile)) {
      this.router.navigate(['/chat'])
    }
  }

  sendTokenToBackend(token: string): void {
    this.http.post(`${HOST}/users/login/google`, { token }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          //this.setupLogin(profile);
          this.socketService.initSocket(profile).then(() => {
            this.setupLogin(profile);
          })
            .catch((err: any) => {
              console.error("Socket connection failed", err);
            }
            );
          console.log("Login | this.localStorage.profile ", this.localStorage.profile);
        },
        error: (err) => { console.error("Error sending token:", err); }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();      // 🛑 Triggers teardown of subscriptions in *this component*
    this.destroy$.complete();
  }
}
