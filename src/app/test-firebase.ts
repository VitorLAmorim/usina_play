import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { ProgramService } from './services/program.service';

// This is a simple test script to verify Firebase functionality
// It can be run manually for testing purposes

export async function testFirebase(authService: AuthService, notificationService: NotificationService, programService: ProgramService) {
  console.log('Starting Firebase test...');

  // Test user authentication
  try {
    // Test registration
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'password123';

    console.log(`Registering test user: ${testEmail}`);
    const user = await new Promise((resolve, reject) => {
      authService.register({email: testEmail, password: testPassword, firstName: 'Test', lastName: 'User'})
        .subscribe({
          next: (user) => resolve(user),
          error: (err) => reject(err)
        });
    });

    console.log('User registered successfully:', user);

    // Test logout
    console.log('Logging out...');
    await new Promise<void>((resolve, reject) => {
      authService.logout().subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
    console.log('Logout successful');

    // Test login
    console.log(`Logging in with: ${testEmail}`);
    const loggedInUser = await new Promise((resolve, reject) => {
      authService.login(testEmail, testPassword)
        .subscribe({
          next: (user) => resolve(user),
          error: (err) => reject(err)
        });
    });

    console.log('Login successful:', loggedInUser);

    // Test notifications CRUD
    console.log('Testing notifications CRUD...');

    // Create notification
    const notification = await new Promise((resolve, reject) => {
      notificationService.createNotification('Test Notification', 'This is a test notification')
        .subscribe({
          next: (notification) => resolve(notification),
          error: (err) => reject(err)
        });
    });

    console.log('Notification created:', notification);

    // Mark notification as read
    if (notification) {
      await new Promise<void>((resolve, reject) => {
        notificationService.readNotification(notification as any)
          .subscribe({
            next: () => resolve(),
            error: (err) => reject(err)
          });
      });

      console.log('Notification marked as read');
    }

    // Test programs CRUD
    console.log('Testing programs CRUD...');

    // Create program
    const program = await new Promise((resolve, reject) => {
      programService.createProgram('Test Program', 'This is a test program')
        .subscribe({
          next: (program) => resolve(program),
          error: (err) => reject(err)
        });
    });

    console.log('Program created:', program);

    // Update program status
    if (program) {
      const programId = (program as any)._id;

      await new Promise<void>((resolve, reject) => {
        programService.startProgram(programId)
          .subscribe({
            next: () => resolve(),
            error: (err) => reject(err)
          });
      });

      console.log('Program status updated to STARTED');

      await new Promise<void>((resolve, reject) => {
        programService.completeProgram(programId)
          .subscribe({
            next: () => resolve(),
            error: (err) => reject(err)
          });
      });

      console.log('Program status updated to COMPLETED');
    }

    console.log('Firebase test completed successfully!');

  } catch (error) {
    console.error('Firebase test failed:', error);
  }
}
