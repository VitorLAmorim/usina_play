import {Component, signal, inject} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonicModule,
    FormsModule
  ],
  standalone: true
})

export class LoginPage {
  private mockService = inject(UserService);
  private router = inject(Router);
  email = '';
  password = '';
  error = '';
  isError = signal(false);

  constructor() { }

  login() {
    this.error = '';
    if (this.mockService.login(this.email, this.password)) {
      this.router.navigate(['/home']);
    } else {
      this.error = 'Email ou senha incorretos';
      this.isError = signal(true);
    }
  }

  createUser() {
    if(this.email === '' || this.password === '') {
      this.isError = signal(true);
      this.error = 'Preencha todos os campos';
      return;
    }
    if(!this.validateEmail(this.email)) {
      this.isError = signal(true);
      this.error = 'Email inválido';
      return;
    }
    this.isError = signal(false);
    this.mockService.createUser(this.email, this.password);
    this.error = 'Usuário criado com sucesso, realize o login';
  }

  validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}
