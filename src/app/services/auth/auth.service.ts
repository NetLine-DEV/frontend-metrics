import { jwtDecode } from 'jwt-decode';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserInfoService } from '../user_info/user-info.service';
import { IUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL: string = environment.api;
  private TOKEN_KEY: string = 'access_token';
  private REFRESH_TOKEN_KEY: string = 'refresh_token';
  private http = inject(HttpClient);
  private toast = inject(ToastrService);
  private userInfoService = inject(UserInfoService);
  private router = inject(Router);
  public userPermissions: string[] = [];
  public isSuperUser: boolean = false;

  login(credentials: { email: string; password: string }): Observable<{ access: string; refresh: string }> {
    return this.http.post<{ access: string; refresh: string }>(`${this.API_URL}/login/`, credentials)
    .pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.access);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh);
        this.getUserPermissions().subscribe({
          next: () => {
            console.log('Permissões carregadas com sucesso!');
          },
          error: (error) => {
            console.error('Erro ao carregar permissões:', error);
          }
        });
        this.toast.success('Login efetuado com sucesso!', 'Sucesso');
        this.router.navigate(['/']);
      }),
      take(1)
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout/`, { refresh: refreshToken })
        .pipe(take(1))
        .subscribe({
          next: () => {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.REFRESH_TOKEN_KEY);
            this.toast.info('Logout realizado com sucesso!');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error(error);
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.REFRESH_TOKEN_KEY);
            this.router.navigate(['/login']);
          }
        });
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);

      if (expirationDate < new Date()) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token inválido:', error);
      this.logout();
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserPermissions(): Observable<void> {
    return new Observable<void>((observer) => {
      this.userInfoService.getUserInfo().subscribe({
        next: (user: IUser) => {
          this.userPermissions = user.groups.flatMap(group => group.permissions.map(permission => permission.codename));
          this.isSuperUser = user.is_superuser;
          observer.next();
          observer.complete();
        },
        error: (error) => {
          console.error('Erro ao buscar permissões do usuário:', error);
          observer.error(error);
        }
      });
    });
  }

  hasPermission(permission: string): boolean {
    return this.userPermissions.includes(permission);
  }

  getPermissionsForRoute(route: string): string[] {
    const routePermissions: { [key: string]: string[] } = {
      'admin': ['admin'],
      'vendas': ['vendas'],
      'marketing': ['marketing'],
      'ti': ['ti'],
      'estrutura': ['estrutura'],
      'faturamento': ['faturamento'],
      'financeiro': ['financeiro'],
      'direcao': ['direcao'],
      'atendimento': ['atendimento'],
    };

    return routePermissions[route] || [];
  }

  canAccessRoute(route: string): boolean {
    if (this.isSuperUser) {
      return true;
    }

    if (route.includes('admin')) {
      return this.hasPermission('admin');
    }

    const pageName = route.split('/').pop();
    if (!pageName) {
      return false;
    }

    const permissions = this.getPermissionsForRoute(pageName);
    if (!permissions) {
      return false;
    }

    return permissions.some(permission => this.userPermissions.includes(permission));
  }
}
