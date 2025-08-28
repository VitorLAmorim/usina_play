import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './services/notification.service';
import { ProgramService } from './services/program.service';
import { UserService } from './services/user.service';

/**
 * This is a test script to verify the fixes for Observable handling
 * It can be imported and used in a component for testing
 */
export function testObservableHandling(notificationService: NotificationService, programService: ProgramService, userService: UserService) {
  console.log('Starting Observable handling test...');

  // Test getPrograms
  console.log('Testing getPrograms...');
  programService.getPrograms().subscribe({
    next: (programs) => {
      console.log(`Retrieved ${programs.length} programs successfully`);
    },
    error: (error) => {
      console.error('Error getting programs:', error);
    }
  });

  // Test getNotifications
  console.log('Testing getNotifications...');
  notificationService.getNotifications().subscribe({
    next: (notifications) => {
      console.log(`Retrieved ${notifications.length} notifications successfully`);
    },
    error: (error) => {
      console.error('Error getting notifications:', error);
    }
  });

  console.log('Observable handling test completed');
}

/**
 * Component for testing the Observable fixes
 * This can be added to a route for manual testing
 */
@Component({
  selector: 'app-test-fix',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Testing Observable Fixes</h1>
      <p>Check the console for test results</p>
      <button (click)="runTest()">Run Test</button>
      <div *ngIf="testResults">
        <h3>Test Results:</h3>
        <pre>{{ testResults }}</pre>
      </div>
    </div>
  `
})
export class TestFixComponent {
  testResults: string = '';

  private notificationService = inject(NotificationService);
  private programService = inject(ProgramService);
  private userService = inject(UserService);

  runTest() {
    this.testResults = 'Running tests... Check console for details.';
    try {
      testObservableHandling(this.notificationService, this.programService, this.userService);
      this.testResults += '\nTests completed. Check console for details.';
    } catch (error) {
      this.testResults += `\nError: ${error}`;
      console.error('Test error:', error);
    }
  }
}
