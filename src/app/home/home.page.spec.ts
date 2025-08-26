import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { UserService } from '../services/user.service';
import { MockService } from '../services/mock.service';
import { AlertController, ModalController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User, UserLevel } from '../models/user.model';
import { CarouselItem } from '../image-carousel/image-carousel.component';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let mockServiceSpy: jasmine.SpyObj<MockService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    _id: '1',
    email: 'test@test.com',
    password: '123',
    name: 'Test',
    lastName: 'User',
    userLevel: UserLevel.PURPLE
  };

  const mockSlides: CarouselItem[] = [
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
    }
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['gerCurrentUser', 'logout']);
    mockServiceSpy = jasmine.createSpyObj('MockService', [
      'getSlides',
      'createSlide',
      'startSlide',
      'completeSlide',
      'visualizeSlide',
      'getNotifications',
      'createNotification'
    ]);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    userServiceSpy.gerCurrentUser.and.returnValue(mockUser);
    mockServiceSpy.getSlides.and.returnValue(mockSlides);
    mockServiceSpy.getNotifications.and.returnValue([
      { _id: '1', title: 'Test', description: 'Test notification', read: false }
    ]);
    mockServiceSpy.carouselObservable = of(mockSlides);
    mockServiceSpy.notificationsObservable = of([
      { _id: '1', title: 'Test', description: 'Test notification', read: false }
    ]);

    const mockAlert = jasmine.createSpyObj<HTMLIonAlertElement>('HTMLIonAlertElement', ['present']);

    alertControllerSpy.create.and.resolveTo(mockAlert);

    const mockModal = jasmine.createSpyObj<HTMLIonModalElement>('HTMLIonModalElement', ['present']);
    modalControllerSpy.create.and.resolveTo(mockModal);

    await TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: MockService, useValue: mockServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user data and carousel items', () => {
    expect(component.user).toEqual(mockUser);
    expect(component.personalTrainerCarouselItems).toEqual(mockSlides);
    expect(component.programsCarouselItems.length).toEqual(mockSlides.length);
    expect(component.contentCarouselItems).toEqual(mockSlides);
    expect(component.hasNewNotifications).toBeTrue();
  });

  it('should open notifications modal', async () => {
    await component.openNotifications();
    expect(modalControllerSpy.create).toHaveBeenCalled();
  });

  it('should update carousel items', () => {
    const newSlides: CarouselItem[] = [
      {
        _id: '3',
        image: 'assets/images/corrida.jpg',
        description: 'CORRIDA',
        status: 'STARTED'
      }
    ];

    component.updateCarousel(newSlides);

    expect(component.personalTrainerCarouselItems).toEqual(newSlides);
    expect(component.programsCarouselItems.length).toEqual(newSlides.length);
    expect(component.contentCarouselItems).toEqual(newSlides);
  });

  it('should open menu with logout option', async () => {
    await component.openMenu();

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Menu',
      buttons: jasmine.any(Array)
    });
  });

  it('should create new slide', async () => {
    const testTitle = 'Test Slide';
    alertControllerSpy.create.and.resolveTo({
      present: jasmine.createSpy('present'),
      onDidDismiss: () => Promise.resolve({
        role: 'ok',
        data: { values: { userInput: testTitle } }
      })
    } as any);

    await component.createNew();

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('should handle slide clicked with NEW status', async () => {
    const mockItem: CarouselItem = {
      _id: '1',
      image: 'test.jpg',
      description: 'TEST',
      status: 'NEW'
    };

    await component.slideClicked(mockItem);

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Marcar treino como visualizado?',
      buttons: jasmine.any(Array)
    });
  });

  it('should handle slide clicked with STARTED status', async () => {
    const mockItem: CarouselItem = {
      _id: '1',
      image: 'test.jpg',
      description: 'TEST',
      status: 'STARTED'
    };

    await component.slideClicked(mockItem);

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Programa iníciado, deseja concluir?',
      buttons: jasmine.any(Array)
    });
  });

  it('should handle slide clicked with COMPLETED status', async () => {
    const mockItem: CarouselItem = {
      _id: '1',
      image: 'test.jpg',
      description: 'TEST',
      status: 'COMPLETED'
    };

    await component.slideClicked(mockItem);

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Programa já concluído, deseja reiniciar?',
      buttons: jasmine.any(Array)
    });
  });

  it('should handle slide clicked with VISUALIZED status', async () => {
    const mockItem: CarouselItem = {
      _id: '1',
      image: 'test.jpg',
      description: 'TEST',
      status: 'VISUALIZED'
    };

    await component.slideClicked(mockItem);

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Iniciar programa?',
      buttons: jasmine.any(Array)
    });
  });
});
