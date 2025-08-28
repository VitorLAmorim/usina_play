import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';
import {BehaviorSubject, from, map, Observable} from 'rxjs';
import {Notification} from "../models/notification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private firestore = inject(Firestore);

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notificationsObservable: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor() {
    this.loadNotifications();
  }

  private async loadNotifications() {
    const notificationsRef = collection(this.firestore, 'notifications');
    const q = query(notificationsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    const notifications: Notification[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data() as Omit<Notification, '_id'>;
      notifications.push({ _id: doc.id, ...data });
    });

    this.notificationsSubject.next(notifications);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notificationsObservable;
  }

  createNotification(title: string, description: string): Observable<Notification> {
    const notificationsRef = collection(this.firestore, 'notifications');
    const newNotification = {
      title,
      description,
      read: false,
      timestamp: new Date()
    };

    return from(addDoc(notificationsRef, newNotification)).pipe(
      map(docRef => {
        const notification: Notification = {
          _id: docRef.id,
          ...newNotification
        };

        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next([notification, ...currentNotifications]);

        return notification;
      })
    );
  }

  readNotification(notification: Notification): Observable<void> {
    const notificationRef = doc(this.firestore, 'notifications', notification._id);
    const updatedNotification = { ...notification, read: true };

    return from(updateDoc(notificationRef, { read: true })).pipe(
      map(() => {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(n =>
          n._id === notification._id ? updatedNotification : n
        );
        this.notificationsSubject.next(updatedNotifications);
      })
    );
  }

  deleteNotification(id: string): Observable<void> {
    const notificationRef = doc(this.firestore, 'notifications', id);

    return from(deleteDoc(notificationRef)).pipe(
      map(() => {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.filter(n => n._id !== id);
        this.notificationsSubject.next(updatedNotifications);
      })
    );
  }
}
