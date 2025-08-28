import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import {of} from "rxjs";
import {User} from "../models/user.model";

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['login', 'createUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    userServiceSpy.createUser.and.returnValue(of({email: 'admin@admin.com', password: '123456', firstName: 'Admin', lastName: 'Admin', userLevel: 'PURPLE'} as User))

    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully with valid credentials', () => {
    userServiceSpy.login.and.returnValue(of(true));
    component.email.setValue('admin@admin.com');
    component.password.setValue('123456');

    component.login();

    expect(userServiceSpy.login).toHaveBeenCalledWith('admin@admin.com', '123456');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.error).toBe('');
    expect(component.isError).not.toEqual(signal(true));
  });

  it('should show error message with invalid credentials', () => {
    userServiceSpy.login.and.returnValue(of(false));
    component.email.setValue('wrong@email.com');
    component.password.setValue('wrongpassword');

    component.login();

    expect(userServiceSpy.login).toHaveBeenCalledWith('wrong@email.com', 'wrongpassword');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.error).toBe('Email ou senha incorretos');
  });

  it('should create user successfully with valid data', () => {
    component.email.setValue('new@user.com');
    component.password.setValue('password123');
    component.password2.setValue('password123');
    component.name.setValue('New User')

    component.saveUser();

    expect(userServiceSpy.createUser).toHaveBeenCalledWith({email: 'new@user.com', password: 'password123', firstName: 'New', lastName: 'User'});
    expect(component.error.normalize('NFC')).toEqual('Usuário criado com sucesso, realize o login'.normalize('NFC'));
  });

  it('should show error when creating user with empty fields', () => {
    component.email.setValue('');
    component.password.setValue('');
    component.password2.setValue('');
    component.name.setValue('')

    component.saveUser();

    expect(userServiceSpy.createUser).not.toHaveBeenCalled();
    expect(component.error).toBe('Dados incorretos');
  });

  it('should show error when creating user with invalid email', () => {
    component.email.setValue('invalid-email');
    component.password.setValue('password123');
    component.password2.setValue('password123');
    component.name.setValue('New User')

    component.saveUser();

    expect(userServiceSpy.createUser).not.toHaveBeenCalled();
    expect(component.error.normalize('NFC')).toBe('Dados incorretos'.normalize('NFC'));
  });

  it('should validate email correctly', () => {
    expect(component.validateEmail('test@example.com')).toBeTrue();
    expect(component.validateEmail('user.name@domain.co.uk')).toBeTrue();
    expect(component.validateEmail('user+tag@example.org')).toBeTrue();

    expect(component.validateEmail('invalid-email')).toBeFalse();
    expect(component.validateEmail('missing@domain')).toBeFalse();
    expect(component.validateEmail('@domain.com')).toBeFalse();
    expect(component.validateEmail('user@.com')).toBeFalse();
    expect(component.validateEmail('')).toBeFalse();
  });
});
