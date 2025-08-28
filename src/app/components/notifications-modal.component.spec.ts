import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsModalComponent } from './notifications-modal.component';
import { NotificationService } from '../services/notification.service';
import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import {Notification} from "../models/notification.model";

describe('NotificationsModalComponent', () => {
  let component: NotificationsModalComponent;
  let fixture: ComponentFixture<NotificationsModalComponent>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let notificationsSubject: BehaviorSubject<Notification[]>;

  const mockNotifications: Notification[] = [
    {
      _id: '1',
      title: 'Notification 1',
      description: 'Description 1',
      read: false
    },
    {
      _id: '2',
      title: 'Notification 2',
      description: 'Description 2',
      read: true
    }
  ];

  beforeEach(() => {
    notificationsSubject = new BehaviorSubject<Notification[]>(mockNotifications);

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['readNotification']);
    notificationServiceSpy.notificationsObservable = notificationsSubject.asObservable();

    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with notifications from service', (done) => {
    component.notifications$.subscribe(notifications => {
      expect(notifications).toEqual(mockNotifications);
      done();
    });
  });

  it('should close the modal when close() is called', () => {
    component.close();

    expect(modalControllerSpy.dismiss).toHaveBeenCalled();
  });

  it('should mark notification as read', () => {
    const notification = mockNotifications[0];

    component.markAsRead(notification);

    expect(notificationServiceSpy.readNotification).toHaveBeenCalledWith(notification);
  });

  it('should update notifications when service emits new values', (done) => {
    const updatedNotifications: Notification[] = [
      {
        _id: '1',
        title: 'Updated Notification',
        description: 'Updated Description',
        read: true
      }
    ];

    notificationsSubject.next(updatedNotifications);

    component.notifications$.subscribe(notifications => {
      expect(notifications).toEqual(updatedNotifications);
      done();
    });
  });
});
