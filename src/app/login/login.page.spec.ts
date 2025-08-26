import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['login', 'createUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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
    userServiceSpy.login.and.returnValue(true);
    component.email = 'admin@admin.com';
    component.password = '123456';

    component.login();

    expect(userServiceSpy.login).toHaveBeenCalledWith('admin@admin.com', '123456');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.error).toBe('');
    expect(component.isError).not.toEqual(signal(true));
  });

  it('should show error message with invalid credentials', () => {
    userServiceSpy.login.and.returnValue(false);
    component.email = 'wrong@email.com';
    component.password = 'wrongpassword';

    component.login();

    expect(userServiceSpy.login).toHaveBeenCalledWith('wrong@email.com', 'wrongpassword');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.error).toBe('Email ou senha incorretos');
  });

  it('should create user successfully with valid data', () => {
    component.email = 'new@user.com';
    component.password = 'password123';

    component.createUser();

    expect(userServiceSpy.createUser).toHaveBeenCalledWith('new@user.com', 'password123');
    expect(component.error.normalize('NFC')).toEqual('Usuário criado com sucesso, realize o login'.normalize('NFC'));
  });

  it('should show error when creating user with empty fields', () => {
    component.email = '';
    component.password = '';

    component.createUser();

    expect(userServiceSpy.createUser).not.toHaveBeenCalled();
    expect(component.error).toBe('Preencha todos os campos');
  });

  it('should show error when creating user with invalid email', () => {
    component.email = 'invalid-email';
    component.password = 'password123';

    component.createUser();

    expect(userServiceSpy.createUser).not.toHaveBeenCalled();
    expect(component.error.normalize('NFC')).toBe('Email inválido'.normalize('NFC'));
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
