import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

interface UserRegister {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {
  private API_URL: string = environment.api;
  private http = inject(HttpClient);

  registerUser(credentials: UserRegister): Observable<UserRegister> {
    return this.http.post<UserRegister>(`${this.API_URL}/register/`, credentials).pipe(take(1));
  }
}
