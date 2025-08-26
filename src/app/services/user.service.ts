import {Injectable} from '@angular/core';
import {User, UserLevel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private mockUser: User = {_id: '1', email: 'test@test.com', password: '123', name: 'Vitor', lastName: 'Leandro Amorim', userLevel: UserLevel.PURPLE };
  private DBUsers = [this.mockUser];
  private lastId = 1;
  public loggedUser: User | null = null;


  login(email: string, password: string): boolean {
    const user = this.DBUsers.find(user => user.email === email);
    if(!user) {
      return false;
    }
    this.loggedUser = user;
    return  password === user.password;
  }

  createUser(email: string, password: string) {
    this.lastId++;
    this.DBUsers.push({...this.mockUser, email, password,
      _id: this.lastId.toString() });
  }

  gerCurrentUser(): User {
    if(!this.loggedUser) {
      return this.mockUser;
      // throw new Error('Usuário não logado');
    }
    return this.loggedUser;
  }

  logout() {
    this.loggedUser = null;
  }

}
