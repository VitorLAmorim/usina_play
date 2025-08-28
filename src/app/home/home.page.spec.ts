import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { ProgramService } from '../services/program.service';
import { AlertController, ModalController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User, UserLevel } from '../models/user.model';

import {Program} from "../models/program.model";

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let programServiceSpy: jasmine.SpyObj<ProgramService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    email: 'test@test.com',
    password: '123',
    firstName: 'Test',
    lastName: 'User',
    userLevel: UserLevel.PURPLE
  };

  const mockPrograms: Program[] = [
    {
      _id: '1',
      image: 'assets/images/aquecimento.jpg',
      title: 'AQUECIMENTO',
      description: 'AQUECIMENTO',
      status: 'NEW'
    },
    {
      _id: '2',
      image: 'assets/images/ioga.jpg',
      title: 'YOGA EXPERIENCE',
      description: 'YOGA EXPERIENCE',
      status: 'VISUALIZED'
    }
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser', 'logout']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'getNotifications',
      'createNotification',
      'readNotification',
      'deleteNotification'
    ]);
    programServiceSpy = jasmine.createSpyObj('ProgramService', [
      'getPrograms',
      'createProgram',
      'startProgram',
      'completeProgram',
      'visualizeProgram',
      'deleteProgram'
    ]);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    userServiceSpy.getCurrentUser.and.returnValue(mockUser);
    programServiceSpy.getPrograms.and.returnValue(of(mockPrograms));
    notificationServiceSpy.getNotifications.and.returnValue(of([
      { _id: '1', title: 'Test', description: 'Test notification', read: false }
    ]));
    programServiceSpy.carouselObservable = of(mockPrograms);
    notificationServiceSpy.notificationsObservable = of([
      { _id: '1', title: 'Test', description: 'Test notification', read: false }
    ]);

    const mockAlert = jasmine.createSpyObj<HTMLIonAlertElement>('HTMLIonAlertElement', ['present']);

    alertControllerSpy.create.and.resolveTo(mockAlert);

    const mockModal = jasmine.createSpyObj<HTMLIonModalElement>('HTMLIonModalElement', ['present']);
    modalControllerSpy.create.and.resolveTo(mockModal);

    await TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ProgramService, useValue: programServiceSpy },
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
    expect(component.personalTrainerCarouselItems).toEqual(mockPrograms);
    expect(component.programsCarouselItems.length).toEqual(mockPrograms.length);
    expect(component.contentCarouselItems).toEqual(mockPrograms);
    expect(component.hasNewNotifications).toBeTrue();
  });

  it('should open notifications modal', async () => {
    await component.openNotifications();
    expect(modalControllerSpy.create).toHaveBeenCalled();
  });

  it('should update carousel items', () => {
    const newProgram: Program[] = [
      {
        _id: '3',
        image: 'assets/images/corrida.jpg',
        title: 'CORRIDA',
        description: 'corrida teste',
        status: 'STARTED'
      }
    ];

    component.updateCarousel(newProgram);

    expect(component.personalTrainerCarouselItems).toEqual(newProgram);
    expect(component.programsCarouselItems.length).toEqual(newProgram.length);
    expect(component.contentCarouselItems).toEqual(newProgram);
  });

  it('should open menu with logout option', async () => {
    await component.openMenu();

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Menu',
      buttons: jasmine.any(Array)
    });
  });

  it('should create new program', async () => {
    const testTitle = 'Test Program';
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

  it('should handle program clicked with NEW status', async () => {
    const mockItem: Program = {
      _id: '1',
      image: 'test.jpg',
      title: 'TEST',
      description: 'TEST',
      status: 'NEW'
    };

    await component.programClicked(mockItem);

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Marcar treino como visualizado?',
      buttons: jasmine.any(Array)
    });
  });

  it('should handle program clicked with STARTED status', async () => {
    const mockItem: Program = {
      _id: '1',
      image: 'test.jpg',
      title: 'TEST',
      description: 'TEST',
      status: 'STARTED'
    };

    await component.programClicked(mockItem);

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Programa iníciado, deseja concluir?',
      buttons: jasmine.any(Array)
    });
  });

  it('should handle program clicked with COMPLETED status', async () => {
    const mockItem: Program = {
      _id: '1',
      image: 'test.jpg',
      title: 'TEST',
      description: 'TEST',
      status: 'COMPLETED'
    };

    await component.programClicked(mockItem);

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Programa já concluído, deseja reiniciar?',
      buttons: jasmine.any(Array)
    });
  });

  it('should handle program clicked with VISUALIZED status', async () => {
    const mockItem: Program = {
      _id: '1',
      image: 'test.jpg',
      title: 'TEST',
      description: 'TEST',
      status: 'VISUALIZED'
    };

    await component.programClicked(mockItem);

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Iniciar programa?',
      buttons: jasmine.any(Array)
    });
  });
});
