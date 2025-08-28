import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconCircleComponent } from './circle-icon.component';
import { IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

describe('IconCircleComponent', () => {
  let component: IconCircleComponent;
  let fixture: ComponentFixture<IconCircleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, IonIcon]
    }).compileComponents();

    fixture = TestBed.createComponent(IconCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.icon).toBe('help-circle');
    expect(component.color).toBe('#f37a31');
    expect(component.size).toBe(0.5);
  });

  it('should set custom input values correctly', () => {
    component.icon = 'trophy';
    component.color = '#ff0000';
    component.size = 1.5;

    fixture.detectChanges();

    expect(component.icon).toBe('trophy');
    expect(component.color).toBe('#ff0000');
    expect(component.size).toBe(1.5);
  });

  it('should render the correct icon', () => {
    component.icon = 'trophy';

    fixture.detectChanges();
    const iconElement = fixture.nativeElement.querySelector('ion-icon');
    expect(iconElement.name).toBe('trophy');
  });

  it('should apply the correct styles based on inputs', () => {
    component.color = '#00ff00';
    component.size = 2;

    fixture.detectChanges();
    const circleElement = fixture.nativeElement.querySelector('.circle');
    const iconElement = fixture.nativeElement.querySelector('ion-icon');

    expect(circleElement.style.borderColor).toBe('rgb(0, 255, 0)');
    expect(circleElement.style.width).toBe('5rem');
    expect(circleElement.style.height).toBe('5rem');
    expect(circleElement.style.color).toBe('rgb(0, 255, 0)');
    expect(iconElement.style.fontSize).toBe('2rem');
  });
});
