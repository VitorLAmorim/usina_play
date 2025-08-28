import {Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output} from '@angular/core';
import {IonicSlides} from "@ionic/angular";
import {IonBadge, IonContent} from "@ionic/angular/standalone";
import {register} from 'swiper/element/bundle';
import {IconCircleComponent} from "../components/circle-icon.component";
import {Program} from "../models/program.model";

register();

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

  @Input() items: Program[] = [];
  @Input() slidesPerView: number = 2;
  @Input() title = '';
  @Input() showAddButton = false;
  @Input() showNewBadge = false;
  @Input() showStatus = false;

  @Output() addNew = new EventEmitter<void>();
  @Output() programClicked = new EventEmitter<Program>();

  swiperModules = [IonicSlides];

  constructor() {
  }

  get hasNewItem(): boolean {
    return this.showStatus && this.items.some(item => item.status === 'NEW');
  }
}
