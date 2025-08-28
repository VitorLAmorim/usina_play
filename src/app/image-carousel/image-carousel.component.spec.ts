import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImageCarouselComponent } from './image-carousel.component';
import {Program} from "../models/program.model";

describe('ImageCarouselComponent', () => {
  let component: ImageCarouselComponent;
  let fixture: ComponentFixture<ImageCarouselComponent>;

  const mockItems: Program[] = [
    {
      _id: '1',
      image: 'assets/images/aquecimento.jpg',
      title: 'AQUECIMENTO',
      description: 'Exercícios leves para preparar seu corpo e aumentar a circulação antes do treino principal.',
      status: 'NEW'
    },
    {
      _id: '2',
      image: 'assets/images/ioga.jpg',
      title: 'YOGA EXPERIENCE',
      description: 'Sessão de yoga focada em alongamento, respiração e equilíbrio para relaxar a mente e o corpo.',
      status: 'VISUALIZED'
    },
    {
      _id: '3',
      image: 'assets/images/corrida.jpg',
      title: 'CORRIDA',
      description: 'Treino de corrida para melhorar resistência cardiovascular e queimar calorias de forma eficiente.',
      status: 'STARTED'
    },
    {
      _id: '4',
      image: 'assets/images/musculacao.jpg',
      title: 'LEVANTAMENTO DE PESO',
      description: 'Treino de força com pesos para desenvolver músculos, aumentar a resistência e definir o corpo.',
      status: 'NEW'
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

  it('should emit programClicked event with correct item', () => {
    spyOn(component.programClicked, 'emit');
    const testItem = mockItems[0];

    component.programClicked.emit(testItem);

    expect(component.programClicked.emit).toHaveBeenCalledWith(testItem);
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
        title: 'TEST',
        description: 'TEST',
        status: 'COMPLETED'
      },
      {
        _id: '2',
        image: 'test2.jpg',
        title: 'TEST',
        description: 'TEST2',
        status: 'VISUALIZED'
      }
    ];
    component.showStatus = true;

    expect(component.hasNewItem).toBeFalse();
  });
});
