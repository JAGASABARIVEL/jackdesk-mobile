import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { camera, ellipsisVertical, checkmark, closeCircle, document, download, logoGoogle, send, attachOutline, closeOutline  } from 'ionicons/icons';

import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Register the icons you need
addIcons({
  'camera': camera,
  'ellipsis-vertical': ellipsisVertical,
  "checkmark": checkmark,
  "close-circle": closeCircle,
  "document": document,
  "download": download,
  "logo-google": logoGoogle,
  "send": send,
  "attach-outline": attachOutline,
  "close-outline": closeOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    importProvidersFrom(IonicModule.forRoot()),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false, // Set to true if you want auto-login
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleClientId
            ),
          }
        ]
      } as SocialAuthServiceConfig
    }
  ],
});
 