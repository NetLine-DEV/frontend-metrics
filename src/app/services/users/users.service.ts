import { IUser } from './../../models/user.model';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private API_URL: string = environment.api;
  private http: HttpClient = inject(HttpClient);

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.API_URL}/users/`).pipe(take(1));
  }

  getUser(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.API_URL}/users/${id}`).pipe(take(1));
  }

  addUserToGroup(group: FormData, idUser: number) {
    return this.http.put(`${this.API_URL}/users/${idUser}/add-to-group/`, group).pipe(take(1));
  }

  deactivateUser(user: IUser, idUser: number): Observable<IUser> {
    return this.http.post<IUser>(`${this.API_URL}/users/${idUser}/deactivate/`, user).pipe(take(1));
  }
}
