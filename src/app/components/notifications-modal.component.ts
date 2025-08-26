import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { MockService, Notification } from '../services/mock.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
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
        @for (notification of notifications$ | async; track $index) {
          <ion-item [color]="notification.read ? 'light' : 'black'">
            <ion-label>
              <h3>{{ notification.title }}</h3>
              <p>{{ notification.description }}</p>
            </ion-label>
            @if(!notification.read) {
              <ion-button fill="clear" (click)="markAsRead(notification)">
                Marcar como lida
              </ion-button>
            }
          </ion-item>
        }

      </ion-list>
    </ion-content>
  `,
})
export class NotificationsModalComponent implements OnInit {
  private mockService = inject(MockService);
  private modalCtrl = inject(ModalController);

  notifications$!: Observable<any[]>;

  ngOnInit() {
    this.notifications$ = this.mockService.notificationsObservable;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  markAsRead(notification: Notification) {
    this.mockService.readNotification(notification);
  }
}
