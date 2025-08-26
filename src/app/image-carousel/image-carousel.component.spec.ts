import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImageCarouselComponent, CarouselItem } from './image-carousel.component';

describe('ImageCarouselComponent', () => {
  let component: ImageCarouselComponent;
  let fixture: ComponentFixture<ImageCarouselComponent>;

  const mockItems: CarouselItem[] = [
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
      status: 'COMPLETED'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for inputs', () => {
    expect(component.items).toEqual([]);
    expect(component.slidesPerView).toBe(2);
    expect(component.title).toBe('');
    expect(component.showAddButton).toBeFalse();
    expect(component.showNewBadge).toBeFalse();
    expect(component.showStatus).toBeFalse();
  });

  it('should set input values correctly', () => {
    component.items = mockItems;
    component.slidesPerView = 3;
    component.title = 'Test Carousel';
    component.showAddButton = true;
    component.showNewBadge = true;
    component.showStatus = true;

    expect(component.items).toEqual(mockItems);
    expect(component.slidesPerView).toBe(3);
    expect(component.title).toBe('Test Carousel');
    expect(component.showAddButton).toBeTrue();
    expect(component.showNewBadge).toBeTrue();
    expect(component.showStatus).toBeTrue();
  });

  it('should emit addNew event when triggered', () => {
    spyOn(component.addNew, 'emit');

    component.addNew.emit();

    expect(component.addNew.emit).toHaveBeenCalled();
  });

  it('should emit slideClicked event with correct item', () => {
    spyOn(component.slideClicked, 'emit');
    const testItem = mockItems[0];

    component.slideClicked.emit(testItem);

    expect(component.slideClicked.emit).toHaveBeenCalledWith(testItem);
  });

  it('should detect new items correctly when showStatus is true', () => {

    component.items = mockItems;
    component.showStatus = true;

    expect(component.hasNewItem).toBeTrue();
  });

  it('should not detect new items when showStatus is false', () => {

    component.items = mockItems;
    component.showStatus = false;

    expect(component.hasNewItem).toBeFalse();
  });

  it('should not detect new items when no items have NEW status', () => {

    component.items = [
      {
        _id: '1',
        image: 'test.jpg',
        description: 'TEST',
        status: 'COMPLETED'
      },
      {
        _id: '2',
        image: 'test2.jpg',
        description: 'TEST2',
        status: 'VISUALIZED'
      }
    ];
    component.showStatus = true;

    expect(component.hasNewItem).toBeFalse();
  });
});
