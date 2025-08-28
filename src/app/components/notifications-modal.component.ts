import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { NotificationService } from '../services/notification.service';
import { Observable } from 'rxjs';
import {Notification} from "../models/notification.model";

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Notificações</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ng-container *ngIf="notifications$ | async as notifications">
          <ion-item *ngFor="let notification of notifications" [color]="notification.read ? 'light' : 'black'">
            <ion-label>
              <h3>{{ notification.title }}</h3>
              <p>{{ notification.description }}</p>
            </ion-label>
            <ion-button *ngIf="!notification.read" fill="clear" (click)="markAsRead(notification)">
              Marcar como lida
            </ion-button>
          </ion-item>
        </ng-container>
      </ion-list>
    </ion-content>
  `,
})
export class NotificationsModalComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private modalCtrl = inject(ModalController);

  notifications$!: Observable<Notification[]>;

  ngOnInit() {
    this.notifications$ = this.notificationService.notificationsObservable;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  markAsRead(notification: Notification) {
    this.notificationService.readNotification(notification);
  }
}
