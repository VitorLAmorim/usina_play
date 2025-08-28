import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withHashLocation } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {addIcons} from "ionicons";
import { menuOutline, notifications, body, trophy, add, helpCircle} from "ionicons/icons";
import {defineCustomElements} from "ionicons/dist/loader";

import { provideZoneChangeDetection } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment} from "./environments/environment";

addIcons({
  'menu-outline': menuOutline,
  'notifications': notifications,
  'body': body,
  'trophy': trophy,
  'add': add,
  'help-circle': helpCircle
});

defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withHashLocation()),
    provideZoneChangeDetection({
      eventCoalescing: true,
      runCoalescing: true
    }),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
}).catch(err => console.error(err));
