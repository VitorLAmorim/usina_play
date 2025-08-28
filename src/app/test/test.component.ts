import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ProgramService } from '../services/program.service';
import { testFirebase } from '../test-firebase';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Firebase Test</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>Firebase Test Component</h2>
      <p>This component runs tests to verify Firebase functionality.</p>
      <p>Check the console for test results.</p>
      <ion-button (click)="runTests()">Run Tests</ion-button>
      <div *ngIf="testResults">
        <h3>Test Results:</h3>
        <pre>{{ testResults }}</pre>
      </div>
    </ion-content>
  `,
})
export class TestComponent implements OnInit {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private programService = inject(ProgramService);

  testResults: string = '';

  ngOnInit() {
    console.log('Test component initialized');
  }

  async runTests() {
    console.log('Running Firebase tests...');
    this.testResults = 'Running tests... Check console for details.';

    try {
      await testFirebase(this.authService, this.notificationService, this.programService);
      this.testResults = 'Tests completed successfully! Check console for details.';
    } catch (error) {
      console.error('Test error:', error);
      this.testResults = `Tests failed: ${error}`;
    }
  }
}
