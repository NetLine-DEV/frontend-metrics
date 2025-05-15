import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private API_URL: string = environment.api;
  private http: HttpClient = inject(HttpClient);

  sendMail(email: FormGroup) {
    return this.http.post(`${this.API_URL}/password_reset/`, email).pipe(take(1));
  }

  resetPassword(password: FormGroup, uidb64: string, token: string) {
    return this.http.post(`${this.API_URL}/password_reset_confirm/${uidb64}/${token}/`, password).pipe(take(1));
  }
}
