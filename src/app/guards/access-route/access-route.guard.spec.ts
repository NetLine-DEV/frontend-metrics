import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { accessRouteGuard } from './access-route.guard';

describe('accessRouteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => accessRouteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
