import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DataInitializerService } from './services/data-initializer.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private dataInitializer = inject(DataInitializerService);

  constructor() {
    this.initializeFirebase();
  }

  private async initializeFirebase() {
    try {
      await this.dataInitializer.initializeData();
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }
}
