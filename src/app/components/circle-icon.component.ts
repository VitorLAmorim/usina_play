import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-icon-circle',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <div class="circle" [style.border-color]="color"  [style.width.rem]="2.5 * size" [style.height.rem]="2.5 * size" [style.color]="color">
      <ion-icon [style.font-size.rem]="size" [name]="icon"></ion-icon>
    </div>
  `,
  styles: [`
    .circle {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 1px solid var(--primary-color);
      background-color: transparent;
    }
  `]
})
export class IconCircleComponent {
  @Input() icon: string = 'help-circle';
  @Input() color: string = '#f37a31';
  @Input() size: number = 0.5;
}
