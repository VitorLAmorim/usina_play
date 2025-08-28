import {Component, inject, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular/standalone";
import {User, UserLevelLabel} from "../models/user.model";
import {UserService} from "../services/user.service";
import {NotificationService} from "../services/notification.service";
import {ProgramService} from "../services/program.service";
import {ImageCarouselComponent} from "../image-carousel/image-carousel.component";
import {IconCircleComponent} from "../components/circle-icon.component";
import { AlertController } from '@ionic/angular/standalone';
import { NotificationsModalComponent } from '../components/notifications-modal.component';
import {Router} from "@angular/router";
import { IonContent, IonHeader, IonIcon, IonAvatar } from '@ionic/angular/standalone';
import {Program} from "../models/program.model";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    ImageCarouselComponent,
    IconCircleComponent,
    IonContent,
    IonHeader,
    IonIcon,
    IonAvatar
  ],
})

export class HomePage implements OnInit {
  private userService = inject(UserService)
  private notificationService = inject(NotificationService)
  private programService = inject(ProgramService)
  private alertCtrl = inject(AlertController)
  private modalCtrl = inject(ModalController)
  private router = inject(Router)

  public UserLevelLabel = UserLevelLabel
  user!: User;
  personalTrainerCarouselItems: Program[] = [];
  programsCarouselItems: Program[] = [];
  contentCarouselItems: Program[] = [];
  hasNewNotifications = false;

  sortOrder = {
    STARTED: 0,
    NEW: 1,
    VISUALIZED: 2,
    COMPLETED: 3
  }

  constructor() {
  }

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    if(user) {
      this.user = user;
    } else {
      this.router.navigate(['/login']);
    }
    this.programService.carouselObservable.subscribe((programs) => this.updateCarousel(programs));
    this.notificationService.notificationsObservable.subscribe((notifications) => this.hasNewNotifications = notifications.some(n => !n.read));
  }

  async openNotifications() {
    const modal = await this.modalCtrl.create({
      component: NotificationsModalComponent,
    });
    await modal.present();
  }

  updateCarousel(programs?: Program[]) {
    if(programs) {
      this.personalTrainerCarouselItems = programs;
      this.programsCarouselItems = [...programs].sort((a, b) => this.sortOrder[a.status] -  this.sortOrder[b.status]);
      this.contentCarouselItems = programs;
    } else {
      this.programService.getPrograms().subscribe(programs => {
        this.personalTrainerCarouselItems = programs;
        this.programsCarouselItems = [...programs].sort((a, b) => this.sortOrder[a.status] -  this.sortOrder[b.status]);
        this.contentCarouselItems = programs;
      });
    }
  }

 async openMenu() {
    const alert = await this.alertCtrl.create({
      header: 'Menu',
      buttons: [
        {
          text: 'Logout',
          handler: () => {
            this.userService.logout().subscribe({
              next: () => {
                this.router.navigate(['/login']);
              },
              error: (error) => {
                console.error('Error logging out:', error);
              }
            });
          }
        }
      ],
    });
    await alert.present();
  }


  async createNew() {
    const alert = await this.alertCtrl.create({
      header: 'Criar um treino novo',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Digite o titulo',
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Digite a descrição',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: ({title, description}) => {
             this.programService.createProgram(title, description).subscribe();
          },
        },
      ],
    });
    await alert.present();
  }

  async programClicked(item: Program) {
    let header = '';
    let handler = () => {};

    switch (item.status) {
      case "NEW": {
        header = 'Marcar treino como visualizado?'
        handler = () => {
          this.programService.visualizeProgram(item._id).subscribe();
        }
        break;
      }
      case "STARTED": {
        header = 'Programa iníciado, deseja concluir?'
        handler = () => {
          this.programService.completeProgram(item._id).subscribe();
        }
        break;
      }
      case "COMPLETED": {
        header = 'Programa já concluído, deseja reiniciar?'
        handler = () => {
          this.programService.startProgram(item._id).subscribe();
        }
        break;
      }
      case "VISUALIZED": {
        header = 'Iniciar programa?';
        handler = () => {
          this.programService.startProgram(item._id).subscribe();
        }
      }
    }

      const alert = await this.alertCtrl.create({
        header,
        message: item.description,
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
          },
          {
            text: 'Sim',
            handler,
          },
        ],
      });

      await alert.present();

  }

}
