import {Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicSlides} from "@ionic/angular";
import {IonContent, IonBadge} from "@ionic/angular/standalone";
import { register } from 'swiper/element/bundle';
import {IconCircleComponent} from "../components/circle-icon.component";

register();

export interface CarouselItem {
  _id: string;
  image: string;
  description: string;
  status: 'STARTED' | 'COMPLETED' | 'NEW' | 'VISUALIZED';
}

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss'],
  imports: [
    IonContent,
    IonBadge,
    IconCircleComponent
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ImageCarouselComponent  {

  @Input() items: CarouselItem[] = [];
  @Input() slidesPerView: number = 2;
  @Input() title = '';
  @Input() showAddButton = false;
  @Input() showNewBadge = false;
  @Input() showStatus = false;

  @Output() addNew = new EventEmitter<void>();
  @Output() slideClicked = new EventEmitter<CarouselItem>();

  swiperModules = [IonicSlides];

  constructor() {
  }

  get hasNewItem(): boolean {
    return this.showStatus && this.items.some(item => item.status === 'NEW');
  }
}
