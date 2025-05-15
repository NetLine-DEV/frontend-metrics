import { inject, Injectable } from '@angular/core';
import { IPermission } from '../../models/permission.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private API_URL: string = environment.api;
  private http: HttpClient = inject(HttpClient);

  getPermissions(): Observable<IPermission[]> {
    return this.http.get<IPermission[]>(`${this.API_URL}/permissions/`).pipe(take(1));
  }
}
