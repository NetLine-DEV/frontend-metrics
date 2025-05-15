import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const accessRouteGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    if (!authService.userPermissions || authService.userPermissions.length === 0) {
      await authService.getUserPermissions().toPromise();
    }

    if (authService.isSuperUser) {
      return true;
    }

    const isAdminRoute = route.routeConfig?.path?.includes('admin');
    if (isAdminRoute) {
      if (authService.hasPermission('admin')) {
        return true;
      } else {
        console.warn('Acesso negado: usuário não tem permissão "admin" para acessar rotas de admin.');
        router.navigate(['/unauthorized']);
        return false;
      }
    }

    const routeName = route.params?.['pageName'];
    if (routeName && authService.canAccessRoute(routeName)) {
      return true;
    } else {
      console.warn('Acesso negado: usuário não tem permissão para acessar esta rota.');
      router.navigate(['/unauthorized']);
      return false;
    }
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    router.navigate(['/unauthorized']);
    return false;
  }
};
