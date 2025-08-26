import {Injectable} from "@angular/core";
import {CarouselItem} from "../image-carousel/image-carousel.component";
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  _id: string;
  title: string;
  description: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})


export class MockService {
  notifications:Notification[] = [
    {
      _id: '1',
      title: 'Novo treino',
      description: 'Novo treino disponível',
      read: false
    },
    {
      _id: '2',
      title: 'Novo conteúdo',
      description: 'Novo conteúdo disponível',
      read: false
    },
    {
      _id: '3',
      title: 'Promoção',
      description: 'Desconto 10% plano anual',
      read: true
    },
  ]

  slides: CarouselItem[] = [
    {
      _id: '1',
      image: 'assets/images/aquecimento.jpg',
      description: 'AQUECIMENTO',
      status: 'NEW'
    },
    {
      _id: '2',
      image: 'assets/images/ioga.jpg',
      description: 'YOGA EXPERIENCE',
      status: 'VISUALIZED'
    },
    {
      _id: '3',
      image: 'assets/images/corrida.jpg',
      description: 'CORRIDA',
      status: 'STARTED'
    },
    {
      _id: '4',
      image: 'assets/images/musculacao.jpg',
      description: 'LEVANTAMENTO DE PESO',
      status: 'NEW'
    }
  ]

  private slidesSubject = new BehaviorSubject<CarouselItem[]>(this.slides);
  carouselObservable: Observable<CarouselItem[]> = this.slidesSubject.asObservable();

  private notificationsSubject = new BehaviorSubject<Notification[]>(this.notifications);
  notificationsObservable: Observable<Notification[]> = this.notificationsSubject.asObservable();


  private lastMessageId = 4;
  private lastSlideId = 4;

  getSlides(): CarouselItem[] {
    return this.slides;
  }

  createSlide(description: string) {
    this.lastSlideId++;
    this.slides.push({
      _id: this.lastSlideId.toString(),
      image: 'assets/images/aquecimento.jpg',
      description,
      status: 'NEW'
    });
    this.slidesSubject.next([...this.slides])
    this.createNotification('Novo treino disponível', `Treino ${description} disponível`)
  }

  startSlide(id: string) {
    const slide =  this.slides.find(slide => slide._id === id);
    if(!slide) {
      return;
    }
    slide.status = 'STARTED';
    this.slidesSubject.next([...this.slides])
    this.createNotification('Treino inciado', `Treino ${slide.description} iniciado`)
  }

  completeSlide(id: string) {
    const slide =  this.slides.find(slide => slide._id === id);
    if(!slide) {
      return;
    }
    slide.status = 'COMPLETED';
    this.slidesSubject.next([...this.slides])
    this.createNotification('Treino concluído', `Treino ${slide.description} concluído`)
  }

  visualizeSlide(id: string) {
    const slide =  this.slides.find(slide => slide._id === id);
    if(!slide) {
      return;
    }
    slide.status = 'VISUALIZED';
    this.slidesSubject.next([...this.slides])
  }

  getNotifications(): Notification[]{
    return this.notifications;
  }

  readNotification(notification: Notification) {
    notification.read = true;
    this.notificationsSubject.next([...this.notifications])
  }

  createNotification(title: string, description: string) {
    this.lastMessageId++;
    this.notifications.unshift({
      _id: this.lastMessageId.toString(),
      title,
      description,
      read: false
    });
    this.notificationsSubject.next([...this.notifications])
  }

}
