import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { IGroup } from '../../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private API_URL: string = environment.api;
  private http: HttpClient = inject(HttpClient);

  getGroups(): Observable<IGroup[]> {
    return this.http.get<IGroup[]>(`${this.API_URL}/groups/`).pipe(take(1));
  }

  getGroup(id: number): Observable<IGroup> {
    return this.http.get<IGroup>(`${this.API_URL}/groups/${id}/`).pipe(take(1));
  }

  postGroup(group: FormData): Observable<IGroup> {
    return this.http.post<IGroup>(`${this.API_URL}/groups/`, group).pipe(take(1));
  }

  editGroup(group: FormData, id: number): Observable<IGroup> {
    return this.http.put<IGroup>(`${this.API_URL}/groups/${id}/`, group).pipe(take(1));
  }

  deactivateGroup(group: IGroup, id: number): Observable<IGroup> {
    return this.http.post<IGroup>(`${this.API_URL}/groups/${id}/deactivate/`, group).pipe(take(1));
  }
}
