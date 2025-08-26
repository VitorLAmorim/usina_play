import {Component, inject, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular/standalone";
import {User, UserLevelLabel} from "../models/user.model";
import {UserService} from "../services/user.service";
import {MockService} from "../services/mock.service";
import {CarouselItem, ImageCarouselComponent} from "../image-carousel/image-carousel.component";
import {IconCircleComponent} from "../components/circle-icon.component";
import { AlertController } from '@ionic/angular/standalone';
import { NotificationsModalComponent } from '../components/notifications-modal.component';
import {Router} from "@angular/router";
import { IonContent, IonHeader, IonIcon, IonAvatar } from '@ionic/angular/standalone';

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
  private mockService = inject(MockService)
  private alertCtrl = inject(AlertController)
  private modalCtrl = inject(ModalController)
  private router = inject(Router)

  public UserLevelLabel = UserLevelLabel
  user: User;
  personalTrainerCarouselItems: CarouselItem[] = [];
  programsCarouselItems: CarouselItem[] = [];
  contentCarouselItems: CarouselItem[] = [];
  hasNewNotifications = false;

  sortOrder = {
    STARTED: 0,
    NEW: 1,
    VISUALIZED: 2,
    COMPLETED: 3
  }

  constructor() {
    this.user = this.userService.gerCurrentUser();
  }

  ngOnInit(): void {
    this.mockService.carouselObservable.subscribe((slides) => this.updateCarousel(slides));
    this.mockService.notificationsObservable.subscribe((notifications) => this.hasNewNotifications = notifications.some(n => !n.read));
    this.hasNewNotifications = this.mockService.getNotifications().some(n => !n.read);
  }

  async openNotifications() {
    const modal = await this.modalCtrl.create({
      component: NotificationsModalComponent,
    });
    await modal.present();
  }

  updateCarousel(slides?: CarouselItem[]) {
    if(slides) {
      this.personalTrainerCarouselItems = slides;
      this.programsCarouselItems = [...slides].sort((a, b) => this.sortOrder[a.status] -  this.sortOrder[b.status]);
      this.contentCarouselItems = slides;
    } else {
      this.personalTrainerCarouselItems = this.mockService.getSlides();
      this.programsCarouselItems = [...this.mockService.getSlides()].sort((a, b) => this.sortOrder[a.status] -  this.sortOrder[b.status]);
      this.contentCarouselItems = this.mockService.getSlides();
    }
  }

 async openMenu() {
    const alert = await this.alertCtrl.create({
      header: 'Menu',
      buttons: [
        {
          text: 'Logout',
        handler: () => {
        this.userService.logout();
        this.router.navigate(['/login']);
    }
        }
      ],
    });
    await alert.present();
  }


  async createNew() {
    const alert = await this.alertCtrl.create({
      header: 'Título',
      inputs: [
        {
          name: 'userInput',
          type: 'text',
          placeholder: 'Digite aqui...',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: (data) => {
             this.mockService.createSlide(data.userInput);
          },
        },
      ],
    });
    await alert.present();
  }

  async slideClicked(item: CarouselItem) {
    let header = '';
    let handler = () => {};

    switch (item.status) {
      case "NEW": {
        header = 'Marcar treino como visualizado?'
        handler = () => {
          this.mockService.visualizeSlide(item._id);
        }
        break;
      }
      case "STARTED": {
        header = 'Programa iníciado, deseja concluir?'
        handler = () => {
          this.mockService.completeSlide(item._id);
        }
        break;
      }
      case "COMPLETED": {
        header = 'Programa já concluído, deseja reiniciar?'
        handler = () => {
          this.mockService.startSlide(item._id);
        }
        break;
      }
      case "VISUALIZED": {
        header = 'Iniciar programa?';
        handler = () => {
          this.mockService.startSlide(item._id);
        }
      }
    }

      const alert = await this.alertCtrl.create({
        header,
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
