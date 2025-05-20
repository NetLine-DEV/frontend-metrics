import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserInfoService } from '../../services/user_info/user-info.service';
import { IUser } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { heroArrowLeftStartOnRectangleSolid, heroChartPieSolid, heroChevronDownSolid, heroInformationCircleSolid, heroUserCircleSolid, heroUserGroupSolid, heroUserSolid, heroUsersSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NgIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  viewProviders: [
    provideIcons({ heroUserSolid, heroUserCircleSolid, heroInformationCircleSolid, heroArrowLeftStartOnRectangleSolid, heroChartPieSolid, heroChevronDownSolid, heroUserGroupSolid, heroUsersSolid }),
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public user: IUser | null = null;
  public menuItems = [
    { label: 'Admin', route: 'admin' },
    { label: 'Vendas', route: 'vendas' },
    { label: 'Cancelamentos', route: 'cancelamentos' },
    { label: 'Atendimentos', route: 'atendimentos' },
    { label: 'Financeiro', route: 'financeiro' },
    { label: 'Planos', route: 'planos' }
  ];

  private authService = inject(AuthService);
  private userInfoService = inject(UserInfoService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getUserInfo();
    this.authService.getUserPermissions().subscribe({
      next: () => {
        console.log('Permissões carregadas:', this.authService.userPermissions);
      },
      error: (error) => {
        console.error('Erro ao carregar permissões:', error);
      }
    });
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  getUserInfo(): void {
    this.userInfoService.getUserInfo().subscribe({
      next: (response: IUser) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Erro ao obter informações do usuário!', error);
      }
    })
  }

  hasPermission(route: string): boolean {
    if (this.authService.isSuperUser) {
      return true;
    }

    const requiredPermissions = this.authService.getPermissionsForRoute(route);

    return requiredPermissions.some(permission =>
      this.authService.userPermissions.includes(permission)
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
