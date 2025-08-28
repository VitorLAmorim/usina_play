import {Component, signal, inject} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {of, tap} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    ReactiveFormsModule
  ],
  standalone: true
})

export class LoginPage {
  private userService = inject(UserService);
  private fb = inject(NonNullableFormBuilder)

  public router = inject(Router);
  createUser = signal(false);

  form: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    password2: FormControl<string>;
  }>;

  error = '';
  isError = signal(false);

  constructor() {
    this.form = this.fb.group({
      name: this.fb.control('', []),
      email: this.fb.control('', {validators: [Validators.required, Validators.email]}),
      password: this.fb.control('', {validators: [Validators.required, Validators.minLength(6)]}),
      password2: this.fb.control('', [])
    })
  }

  get name() {
    return this.form.controls.name;
  }
  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }
  get password2() {
    return this.form.controls.password2;
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.createUser()) {
      this.saveUser();
    } else {
      this.login();
    }
  }

  login() {
    this.error = '';
    if(!this.form.valid){
      this.isError.set(true);
      this.error = 'Dados incorretos';
      return;
    }
    this.userService.login(this.email.value, this.password.value).subscribe(success => {
      if (success) {
        this.form.reset();
        this.router.navigate(['/home']);
      } else {
        this.error = 'Email ou senha incorretos';
        this.isError = signal(true);
      }
    })
  }


  saveUser() {
    if(!this.form.valid) {
      this.isError.set(true);
      this.error = 'Dados incorretos';
      return;
    }

    if (this.password.value !== this.password2.value) {
      this.isError.set(true);
      this.error = 'Senhas não coincidem';
      return;
    }

    const { email, password, name } = this.form.controls;

    const firstName = name.value.split(' ')[0];
    const lastName = name.value.split(' ').slice(1).join(' ');
    this.userService.createUser({ email: email.value, password: password.value, firstName, lastName }).pipe(
      tap(user => {
        if(user) {
          this.toggleLogin();
          this.isError.set(false);
          this.error = 'Usuário criado com sucesso, realize o login';
          this.name.setValue('');
          this.password2.setValue('');
        }
      }),
      catchError(() => {
        this.isError.set(true);
        this.error = 'Erro ao criar usuário';
        return of()
      })
    ).subscribe();
  }

  toggleLogin(){
    this.createUser.set(!this.createUser());
    this.toggleNameValidators(this.createUser())
  }

  toggleNameValidators(required: boolean) {
    if (required) {
      this.name.setValidators([Validators.required]);
      this.password2.setValidators([Validators.required, Validators.minLength(6)])
    } else {
      this.name.clearValidators();
      this.password2.clearValidators();
    }
    this.name.updateValueAndValidity();
    this.password2.updateValueAndValidity();
  }

  validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  protected readonly signal = signal;
}
