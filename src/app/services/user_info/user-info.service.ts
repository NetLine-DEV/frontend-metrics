import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, take } from 'rxjs';
import { IUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private API_URL: string = environment.api;
  private http = inject(HttpClient);

  getUserInfo(): Observable<IUser> {
    return this.http.get<IUser>(`${this.API_URL}/user-details/`).pipe(take(1));
  }
}
